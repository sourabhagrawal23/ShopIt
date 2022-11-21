// const Cart = require('../models/cart');
// const CartItem = require('../models/cart-item');
const Product = require('../models/product');
// const Order = require('../models/order');

exports.getAddProduct = (req, res, next) => {
    //send method automatically sets content type to HTML
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render('admin/add-product', { pageTitle: 'Add Product', path: '/admin/add-product', formsCSS: true, productCSS: true, activeAddProduct: true })
}


exports.postAddProduct = (req, res, next) => {
    // products.push({ title: req.body.title });
    // console.log(req.body);

    const product = new Product(req.body.title);
    product.save();

    res.redirect('/');
}


exports.getProducts = (req, res, next) => {
    // console.log(adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
    //don't need shop.pug because we have set shop as the default template in app.js

    // Code for file system
    // Product.fetchAll( products => {
    //     res.render('shop/product-list', { prods: products, pageTitle: 'All Products', path: '/products' });
    // })

    // Code for Core SQL
    // Product.fetchAll().then(([rows]) => {
    //     res.render('shop/product-list', { prods: rows, pageTitle: 'All Products', path: '/products' });
    // })
    // .catch(err => console.log(err));

    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All products',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
}

//Code for FileSystem
// exports.getProduct = (req,res,next) => {
//     const prodId = req.params.productId;
//     Product.findById(prodId, product => {
//         console.log(prodId);
//         res.render('shop/product-detail', {
//             product: product,
//             pageTitle: product.title,
//             path: '/products'  
//         });
//     });
// }

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        }).catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
    //Code for filesystem
    // Product.fetchAll( products => {
    //     res.render('shop/index', { prods: products, pageTitle: 'Shop', path: '/'});
    // })

    //Code for core SQL
    // Product.fetchAll()
    // .then(([rows, fieldData]) => {
    //     res.render('shop/index', { prods: rows, pageTitle: 'Shop', path: '/'});       
    // })
    // .catch(err => console.log(err));


    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        })

}

exports.getCart = (req, res, next) => {
    req.user
    .getCart()
    .then(products => {
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
        });
    })
    .catch(err => console.log(err));
    
    
    // req.user
    //     .getCart()
    //     .then(cart => {
    //         return cart
    //             .getProducts().
    //             then(products => {
    //                 res.render('shop/cart', {
    //                     path: '/cart',
    //                     pageTitle: 'Your Cart',
    //                     products: products
    //                 });
    //             })
    //     })
    //     .catch(err => console.log(err));

    // Cart.getCart(cart => {
    //     Product.fetchAll(products => {
    //         const cartProducts = [];
    //         for(product of products) {
    //             const cartProductData = cart.products.find(
    //                 prod => prod.id === product.id
    //             );
    //             if(cartProductData) {
    //                 cartProducts.push({ productData: product, qty: cartProductData.qty})
    //             }
    //         }

    //         res.render('shop/cart', {
    //             path:'/cart',
    //             pageTitle: 'Your Cart',
    //             products: cartProducts
    //         });
    //     });
    // });
};

// exports.postCart = (req, res, next) => {
//     const prodId = req.body.productId;
//     Product.findById(prodId, product => {
//         Cart.addProduct(prodId, product.price);
//     });
//     res.redirect('/cart');
// };

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product. findById(prodId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        res.redirect('/cart');
        console.log(result);
    });

    // let fetchedCart;
    // let newQuantity = 1;
    // req.user
    //     .getCart()
    //     .then(cart => {
    //         fetchedCart = cart;
    //         return cart.getProducts({ where: { id: prodId } });
    //     })
    //     .then(products => {
    //         let product;
    //         if (products.length > 0) {
    //             product = products[0];
    //         }

    //         if (product) {
    //             const oldQuantity = product.cartItem.quantity;
    //             newQuantity = oldQuantity + 1;
    //             return product;
    //         }
    //         return Product.findByPk(prodId);
    //     })
    //     .then(product => {
    //         return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    //     })
    //     .then(() => {
    //         res.redirect('/cart');
    //     })
    //     .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    req.user.deleteItemFromCart(prodId)
    // .getCart()
    // .then(cart => {
    //      return cart.getProducts({ where: { id: prodId } });
    // })
    // .then(products => {
    //     const product = products[0];
    //     product.cartItem.destroy();
    // })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));

    // Product.findById(prodId, product => {
    //     Cart.deleteProduct(prodId, product.price);
    //     res.redirect('/cart');
    // });
};

// exports.postOrder = (req, res, next) => {
//     let fetchedCart;
//     req.user
//     .getCart()
//     .then(cart => {
//         fetchedCart = cart;
//         return cart.getProducts();
//     })
//     .then(products => {
//         return req.user.createOrder()
//         .then(order=> {
//             order.addProducts(products.map(product => {
//                 product.orderItem = { quantity: product.cartItem.quantity };
//                 return product;
//             }));
//         })
//         .catch(err => {console.log(err)});
//     })
//     .then(result => {
//         fetchedCart.setProducts(null);
//         res.redirect('/orders');
//     })
//     .catch(err => console.log(err));
// }

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
    .addOrder()
    .then(result => {
        res.redirect('/orders');
    })
    .catch(err => console.log(err));
}

//sequelize code
// exports.getOrders = (req, res, next) => {
//     req.user
//     .getOrders({include: ['products']})
//     .then(orders => {
//         res.render('shop/orders', {
//             path: '/orders',
//             pageTitle: 'Your Orders',
//             orders: orders
//         });
//     })
//     .catch(err => {console.log(err)});
// }

exports.getOrders = (req, res, next) => {
    req.user
    .getOrders()
    .then(orders => {
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders
        });
    })
    .catch(err => {console.log(err)});
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
}