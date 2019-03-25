const nginxAutoConfig = require("../index");
const path = require("path");

const SECRET = process.env["SECRET_VARIABLE"];

nginxAutoConfig.start(path.join(__dirname, "config"), 18888, SECRET, "/etc/nginx/conf.d/example-autogen/", () => {
    return {
        BACKEND_PORT: 3000
    }
});