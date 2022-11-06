const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    //send method automatically sets content type to HTML
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render('admin/add-product', {pageTitle: 'Add Product', path: '/admin/add-product',formsCSS: true, productCSS: true, activeAddProduct: true})
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
        res.render('shop/product-list', { prods: products, pageTitle: 'All Products', path: '/products' });
    })
}

exports.getIndex = (req,res,next) => {
    Product.fetchAll( products => {
        res.render('shop/index', { prods: products, pageTitle: 'Shop', path: '/'});
    })
}

exports.getCart = (req,res,next) => {
    res.render('shop/cart', {
        path:'/cart',
        pageTitle: 'Your Cart'
    });
}

exports.getOrders = (req,res,next) => {
    res.render('shop/orders', {
        path:'/orders',
        pageTitle: 'Your Orders'
    });
}

exports.getCheckout = (req,res,next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
}