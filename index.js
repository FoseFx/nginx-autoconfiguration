const fs = require("fs");
const path = require("path");

const NGINX_PATH = process.env['NGINX_AUTO_CONFIG_NGINX_PATH'] || "/etc/nginx/conf.d/";

const configs = [];
const variables = {};

function collectConfigs(p) {

    fs.readdirSync(path.join(__dirname, p)).forEach((f) => {
        if(/^.*\.conf$/.test(f)){
            collectConfig(`./${p}/${f}`);
        }
        else if(/^((?!\.conf).)*$/.test(f))
            collectConfigs(p + "/" + f);
    });

}
collectConfigs("config");

function collectConfig(file){
    console.log("Detected config", file);
    const content = fs.readFileSync(path.join(__dirname, file), "utf-8");
    configs.push({file, content});
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

// gets called when 100% validated
function handler(callbefore){
    const res = callbefore();
    console.log("Going to set Variables: ");
    for (key of Object.keys(res)) {
        console.log("\t-", key, res[key]);
    }
}

handler(() => {return {BACKEND_PORT: 3000}});