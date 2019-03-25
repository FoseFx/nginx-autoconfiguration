const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");
const http = require('http');
const { exec } = require('child_process');

/**
 * This will start a http server on a specified port.
 * On request the header 'Authorization' gets compared with the secret.
 * If they are equal func gets evaluated and will interpolate the results into your config files
 * At the end it will restart the nginx service using ("systemctl restart nginx"), make sure this
 * application has the permissions to do so
 * 
 * @param {Path} CONFIG_FOLDER - path to your config files, (absolute) that should be interpolated
 * @param {Number} PORT 
 * @param {String} SECRET 
 * @param {String} NGINX_PATH - Path to nginx config folder
 * @param {Function} func - this must return an object with every used variable as key
 */
function start(CONFIG_FOLDER, PORT, SECRET, NGINX_PATH, func){

    const configs = [];
    const variables = {};
    
    function collectConfigs(p) {
    
        fs.readdirSync(p).forEach((f) => {
            if(/^.*\.conf$/.test(f)){
                collectConfig(`${p}/${f}`);
            }
            else if(/^((?!\.conf).)*$/.test(f))
                collectConfigs(p + "/" + f);
        });
    
    }
    collectConfigs(CONFIG_FOLDER);
    
    function collectConfig(file){
        console.log("Detected config", file);
        const content = fs.readFileSync(file, "utf-8");
        configs.push({file: path.relative(CONFIG_FOLDER, file), content});
    }
    
    
    configs.forEach(({file, content}) => {
        const matches = content.match(/\${.*}/g);
        matches.forEach((variabl) => {
            variabl = variabl.replace(/[\$\{\}]/g, '');
            if(!variables[variabl]){
                variables[variabl] = null;
            }
        });
    });
    
    async function handler(callbefore, req){
        try {
            const pres = callbefore(req);

            const res = await Promise.resolve(pres);

            for (key of Object.keys(res)) {
                variables[key] = res[key];
            }
        
            console.log("Going to set Variables: ");
            for (key of Object.keys(variables)) {
                console.log("\t-", key, variables[key]);
                if(variables[key] === null){
                    console.error("Fatal", key, "not set");
                    return;
                }
            }
        
            configs.forEach(({file, content}) => {
                let file_content = content;
                for (key of Object.keys(variables)) {
                    file_content = content.replace(new RegExp(`\\$\\{${key}\\}`, "g"), variables[key]);            
                }
                fsExtra.outputFileSync(path.join(NGINX_PATH, file), file_content, "utf-8");
                console.log("Wrote", path.join(NGINX_PATH, file));
            });


            console.log("Restart NGINX...");
            exec('systemctl restart nginx', (err, stdout, stderr) => {
                if (err) {
                    console.error("Could not restart nginx, are you root?");
                    console.error(err);
                    return;
                }
                console.log("Ok");
                
            });

        } catch (error) {
            console.error(error);
        }
        
    }
    
    
    //create a server object:
    http.createServer(function (req, res) {
        const secret = req.headers['authorization'];
        if(secret !== SECRET){
            res.write("Nope");
            res.end();
            return;
        }
        res.write('Ok');
        res.end();
    
        handler(func, req);
    }).listen(PORT, () => {console.log("NGINX-AUTOCONFIG started on " + PORT);});
}

module.exports = {start};