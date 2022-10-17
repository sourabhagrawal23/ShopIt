const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//it parses body only sent via form.
app.use(bodyParser.urlencoded({extended: true}));

app.use('/add-product',(req, res, next) => {
    console.log('In users!');
    //send method automatically sets content type to HTML
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>')
});


app.post('/product', (req,res,next) => {
    console.log(req.body);
    res.redirect('/');
});


app.use('/', (req,res,next) => {
    console.log('This always runs!');
    //res.send('<h1>Common</h1>')
});


//passed app as it is a va;id request handler
//const server = http.createServer(app);

app.listen(3000);