const path = require('path')

const express = require('express');

const productsController = require('../controllers/products');

//This route is like a mini Express app which can be tied to the other Express apps
const router = express.Router();

router.get('/', productsController.getProducts);

module.exports = router;