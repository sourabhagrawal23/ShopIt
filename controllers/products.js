const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    //send method automatically sets content type to HTML
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render('add-product', {pageTitle: 'Add Product', path: '/admin/add-product',formsCSS: true, productCSS: true, activeAddProduct: true})
}


exports.postAddProduct = (req,res,next) => {
    // products.push({ title: req.body.title });
    // console.log(req.body);

    const product = new Product(req.body.title);
    product.save();

    res.redirect('/');
}


exports.getProducts = (req,res,next) => {
    // console.log(adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
    //don't need shop.pug because we have set shop as the default template in app.js
    Product.fetchAll( products => {
        res.render('shop', { prods: products, pageTitle: 'Shop', path: '/', hasProducts: products.length > 0, activeShop: true, productCSS: true });
    })
}