const path = require('path')

const express = require('express');

const shopController = require('../controllers/shop');

//This route is like a mini Express app which can be tied to the other Express apps
const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

// router.get('/cart', shopController.getCart);

// router.post('/cart', shopController.postCart);

// router.post('/create-order', shopController.postOrder);

// router.get('/orders', shopController.getOrders);

// // router.get('/checkout', shopController.getCheckout);

// router.post('/cart-delete-item', shopController.postCartDeleteProduct)

module.exports = router;