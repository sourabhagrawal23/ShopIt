const express = require('express');

//This route is like a mini Express app which can be tied to the other Express apps
const router = express.Router();

router.get('/', (req,res,next) => {
    console.log('This always runs!');
    res.send('<h1>Common</h1>')
});

module.exports = router;