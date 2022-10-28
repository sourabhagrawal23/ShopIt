const path = require('path')

const express = require('express');

const rootDir = require('../util/path');

//This route is like a mini Express app which can be tied to the other Express apps
const router = express.Router();
const adminData = require('./admin');

router.get('/', (req,res,next) => {
    // console.log(adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))

    const products = adminData.products;

    //don't need shop.pug because we have set shop as the default template in app.js
    res.render('shop', {prods: products, pageTitle: 'Shop', path: '/'});

});

module.exports = router;