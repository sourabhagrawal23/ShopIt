const Cart = require('../models/cart');
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

    // Code for file system
    // Product.fetchAll( products => {
    //     res.render('shop/product-list', { prods: products, pageTitle: 'All Products', path: '/products' });
    // })

    Product.fetchAll().then(([rows]) => {
        res.render('shop/product-list', { prods: rows, pageTitle: 'All Products', path: '/products' });
    })
    .catch(err => console.log(err));

}

exports.getProduct = (req,res,next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        console.log(prodId);
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'  
        });
    });
}

exports.getIndex = (req,res,next) => {
    //Code for filesystem
    // Product.fetchAll( products => {
    //     res.render('shop/index', { prods: products, pageTitle: 'Shop', path: '/'});
    // })

    Product.fetchAll()
    .then(([rows, fieldData]) => {
        res.render('shop/index', { prods: rows, pageTitle: 'Shop', path: '/'});       
    })
    .catch(err => console.log(err));
}   

exports.getCart = (req,res,next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for(product of products) {
                const cartProductData = cart.products.find(
                    prod => prod.id === product.id
                );
                if(cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty})
                }
            }
            
            res.render('shop/cart', {
                path:'/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
};

exports.postCartDeleteProduct =(req,res,next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
};

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