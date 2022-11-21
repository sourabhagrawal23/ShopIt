const express = require('express');
const path = require('path');

const adminController = require('../controllers/admin');
//This route is like a mini Express app which can be tied to the other Express apps
const router = express.Router();

router.get('/add-product', adminController.getAddProduct);

// //admin /admin/products => GET
router.get('/products', adminController.getProducts);

// //admin /admin/products => POST
// //delete,put,patch,use can be used instead of post:
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product',adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

// module.exports = router;

module.exports = router;