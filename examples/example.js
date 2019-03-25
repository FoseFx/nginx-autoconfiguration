const nginxAutoConfig = require("../index");


const SECRET = process.env["SECRET_VARIABLE"];

nginxAutoConfig.start("examples/config", 18888, SECRET, "/etc/nginx/conf.d/", () => {
    return {
        BACKEND_PORT: 3000
    }
});