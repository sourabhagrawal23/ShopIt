const express = require('express');
const path = require('path');

const productsController = require('../controllers/products');
//This route is like a mini Express app which can be tied to the other Express apps
const router = express.Router();

router.get('/add-product', productsController.getAddProduct);

//delete,put,patch,use can be used instead of post:
router.post('/add-product', productsController.postAddProduct);


// module.exports = router;

module.exports = router;