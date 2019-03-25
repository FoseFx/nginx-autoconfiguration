const nginxAutoConfig = require("../index");
const path = require("path");

const SECRET = process.env["SECRET_VARIABLE"];

nginxAutoConfig.start(path.join(__dirname, "config"), 18888, SECRET, "/etc/nginx/conf.d/example-autogen/", () => { 
    
        return new Promise(function(resolve) { // it even works with Promises
        
            setTimeout(() => {
                resolve({BACKEND_PORT: +Date.now()});
            }, 10000);
        
        });
        

    }
);