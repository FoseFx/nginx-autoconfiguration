# NGINX Autoconfiguration

A library that generates your NGINX confguration files on http requests.

## Syntax for configuration files:
Normal nginx syntax, but you can use ${VAR_NAME} anywhere. Where "VAR_NAME" is a variable, which gets interpolated into your config.

## Use: 
[Example 1](examples/example.js)
[Example 2](examples/example2.js)
[Example 3](examples/example3.js)

1. `$ npm i nginx-autoconfig`
2. something like this: 
    `nginxAutoConfig.start("config", 18888, SECRET, "/etc/nginx/conf.d/", () => {
        return {
            BACKEND_PORT: 3000
        }
    });`
3. write a config file and put it into the "config" folder
4. `$ sudo node file.js`
5. Profit.

