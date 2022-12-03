const express = require('express');
const path = require('path');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

//This route is like a mini Express app which can be tied to the other Express apps
const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

// //admin /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// //admin /admin/products => POST
// //delete,put,patch,use can be used instead of post:
router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

// module.exports = router;

module.exports = router;