const path = require('path')

const express = require('express');

const rootDir = require('../util/path');

//This route is like a mini Express app which can be tied to the other Express apps
const router = express.Router();
const adminData = require('./admin');

router.get('/', (req,res,next) => {
    console.log(adminData.products);
    res.sendFile(path.join(rootDir, 'views', 'shop.html'))
});

module.exports = router;