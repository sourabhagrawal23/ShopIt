const express = require('express');

//This route is like a mini Express app which can be tied to the other Express apps
const router = express.Router();

router.get('/add-product',(req, res, next) => {
    console.log('In users!');
    //send method automatically sets content type to HTML
    res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>')
});

//delete,put,patch,use can be used instead of post:
router.post('/add-product', (req,res,next) => {
    console.log(req.body);
    res.redirect('/');
});


module.exports = router;