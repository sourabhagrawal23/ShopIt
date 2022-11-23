const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();


app.set('view engine','ejs');

//app.set('view engine','pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

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
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
    User.findById('637b8ce105699be0c5cf7817')
    .then(user => {
        // req.user = user;
        // Above user was not having methods of user model, hence doing it differently
        // req.user = new User(user.name, user.email, user.cart, user._id);
        req.user = user;
        next();
    })
    .catch(err => {console.log(err)});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//passed app as it is a va;id request handler
//const server = http.createServer(app);

//Handling error for all the HTTP methods - catch all middleware
app.use(errorController.get404);

// mongoConnect(() => {
//     app.listen(3000);
// });

mongoose.connect('mongodb+srv://ShoppingApplication:Password@cluster0.3hs8ppr.mongodb.net/?retryWrites=true&w=majority', {
    dbName: 'Shop',
})
.then(result => {
    User.findOne().then(user => {
        if(!user)
        {
            const user = new User({
                name: 'Sourabh',
                email: 'sourabhkhs23@gmail.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    })
    
    app.listen(3000);
})
.catch( err => {
    console.log(err);
})