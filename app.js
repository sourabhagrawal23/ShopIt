const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.set('view engine','ejs');

//app.set('view engine','pug');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//it parses body only sent via form.
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,'public')))

app.use('/admin', adminData.routes);
app.use(shopRoutes);

//passed app as it is a va;id request handler
//const server = http.createServer(app);

//Handling error for all the HTTP methods - catch all middleware
app.use((req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404', {pageTitle: 'Page not found'});
})

app.listen(3000);