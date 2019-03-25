const nginxAutoConfig = require("../index");
const path = require("path");

const SECRET = process.env["SECRET_VARIABLE"];

nginxAutoConfig.start(path.join(__dirname, "config"), 18888, SECRET, "/etc/nginx/conf.d/example-autogen/", () => {
    
    const random = Math.floor(Math.random() * 10000);
    
    return {
        BACKEND_PORT: random
    }

});