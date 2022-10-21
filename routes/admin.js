const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

//This route is like a mini Express app which can be tied to the other Express apps
const router = express.Router();

router.get('/add-product',(req, res, next) => {
    console.log('In users!');
    //send method automatically sets content type to HTML
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
});

//delete,put,patch,use can be used instead of post:
router.post('/add-product', (req,res,next) => {
    console.log(req.body);
    res.redirect('/');
});


module.exports = router;