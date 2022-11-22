const express = require('express');

const authController = require('../controllers/auth')

//This route is like a mini Express app which can be tied to the other Express apps
const router = express.Router();

router.get('/login', authController.getLogin);


module.exports = router;