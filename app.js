const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product =require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

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
    User.findByPk(1)
    .then(user => {
        req.user = user;
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

// Database Table Associations
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

//Cart associations
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

//Syncing and defining relations in database
sequelize
// .sync({force: true})
.sync()
.then(result => {
    return User.findByPk(1)
    // console.log(result);
    //app.listen(3000);
})
.then(user => {
    if(!user)
    {
        return User.create({ name:'Sourabh', email: 'ceo@sasoftech.in'});
    }
    return Promise.resolve(user);
})
.then(user => {
    // console.log(user);
    return user.createCart();
})
.then(cart => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});