const path = require('path')

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

//This route is like a mini Express app which can be tied to the other Express apps
const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);

// // router.get('/checkout', shopController.getCheckout);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct)

module.exports = router;