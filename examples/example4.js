const nginxAutoConfig = require("../index");
const path = require("path");

const SECRET = process.env["SECRET_VARIABLE"];

nginxAutoConfig.start(path.join(__dirname, "config"), 18888, SECRET, "/etc/nginx/conf.d/example-autogen/", (req) => { // get the request object and do stuff with it
    
        console.log(req.url);
        
        return {BACKEND_PORT: 4343};
        
    }
);