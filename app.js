const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//it parses body only sent via form.
app.use(bodyParser.urlencoded({extended: true}));

app.use(adminRoutes);
app.use(shopRoutes);

//passed app as it is a va;id request handler
//const server = http.createServer(app);

app.listen(3000);