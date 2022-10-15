const http = require('http');

const express = require('express');

const app = express();

//passed app as it is a va;id request handler
const server = http.createServer(app);

server.listen(3000);