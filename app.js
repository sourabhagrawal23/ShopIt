const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer  = require('multer')


const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://ShoppingApplication:Password@cluster0.3hs8ppr.mongodb.net'

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    databaseName: 'Shop',
    collection: 'sessions'
});
const csrfProtection = csrf();

//Storage engine to be used with Multer
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
    {
        //null as error, true to accept this file
        cb(null, true);
    }
    else
    {
        cb(null, false);
    }
};

app.set('view engine', 'ejs');

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
app.use(bodyParser.urlencoded({ extended: true }));

//multer looks for single file
//dest: 'images' stores it inside images folder rather than the buffer
// app.use(multer({dest: 'images'}).single('image'))


app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))

app.use(express.static(path.join(__dirname, 'public')));

//Serve the files inside images folder as if they were in the root folder
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
app.use(csrfProtection);
app.use(flash());

// app.use((req, res, next) => {
//     User.findById('637b8ce105699be0c5cf7817')
//     .then(user => {
//         // req.user = user;
//         // Above user was not having methods of user model, hence doing it differently
//         // req.user = new User(user.name, user.email, user.cart, user._id);
//         req.user = user;
//         next();
//     })
//     .catch(err => {console.log(err)});
// });


app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next (new Error(err));
        });
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//passed app as it is a va;id request handler
//const server = http.createServer(app);

//Route
app.get('/500',errorController.get500);

//Handling error for all the HTTP methods - catch all middleware/handler
app.use(errorController.get404);

app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...);
    // res.redirect('/500');
    res.status(500).render('500', { 
        pageTitle: 'Error!', 
        path: '/500' ,
        isAuthenticated: req.session.isLoggedIn
      });
})

// mongoConnect(() => {
//     app.listen(3000);
// });

mongoose.connect(MONGODB_URI, {
    dbName: 'Shop',
})
    .then(result => {
        // User.findOne().then(user => {
        //     if(!user)
        //     {
        //         const user = new User({
        //             name: 'Sourabh',
        //             email: 'sourabhkhs23@gmail.com',
        //             cart: {
        //                 items: []
        //             }
        //         });
        //         user.save();
        //     }
        // })

        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })