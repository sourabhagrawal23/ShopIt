const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();


app.set('view engine','ejs');

//app.set('view engine','pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// db.execute('SELECT * FROM PRODUCTS')
// .then( result => {
//     console.log(result[0], result[1]);
// })
// .catch( err=> {
//     console.log(err);
// });

//it parses body only sent via form.
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,'public')))

app.use((req, res, next) => {
    User.findById('6378ecb7d37a432399732323')
    .then(user => {
        // req.user = user;
        // Above user was not having methods of user model, hence doing it differently
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    })
    .catch(err => {console.log(err)});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

//passed app as it is a va;id request handler
//const server = http.createServer(app);

//Handling error for all the HTTP methods - catch all middleware
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});