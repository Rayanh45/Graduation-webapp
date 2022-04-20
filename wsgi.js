const app = require("./app");
require('dotenv').config({ path: __dirname+'/.env' });
const http = require("http");


var httpServer = http.createServer(app);

const httpPort = process.env.HTTP_PORT || 4000;

httpServer.listen(httpPort, ()=> {console.log('http on '+httpPort)});
