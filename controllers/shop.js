// const Cart = require('../models/cart');
// const CartItem = require('../models/cart-item');
const Product = require('../models/product');
const Order = require('../models/order');
const product = require('../models/product');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { request } = require('http');
//Add secret key from stripe here
const stripe = require('stripe')('');

const ITEMS_PER_PAGE = 2;

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

    const page = +req.query.page || 1;
    let totalItems;

    Product
        .find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Products',
                path: '/products',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
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
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
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

    // + here converts string to integer
    const page = +req.query.page || 1;
    let totalItems;
    Product
        .find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getCart = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        // .execPopulate()
        // .getCart()
        .then(user => {
            const products = user.cart.items;
            // console.log(product);
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });


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
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
            console.log(result);
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
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

    req.user.removeFromCart(prodId)
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
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });

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
    req.user
        .populate('cart.items.productId')
        //   .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
};


exports.getCheckoutSuccess = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        //   .execPopulate()
        .then(user => {
            console.log("Sourabh");

            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
};

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
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
};


exports.getCheckout = (req, res, next) => {
    let products;
    let total = 0;

    req.user
        .populate("cart.items.productId")
        // .execPopulate()
        // .getCart()
        .then(user => {
            products = user.cart.items;
            // console.log(product);
            let total = 0;
            products.forEach(p => {
                total += p.quantity * p.productId.price;
            })
            return stripe.checkout.sessions.create({
                payment_method_type: ['card'],
                line_items: products.map(p => {
                    return {
                        name: p.productId.title,
                        description: p.productId.description,
                        amount: p.productId.price * 100,
                        currency: 'usd',
                        quantity: p.quantity
                    };
                }),
                success_url: request.protocol + '://' +req.get('host') + '/checkout/success',
                cancel_url: request.protocol + '://' +req.get('host') + '/checkout/cancel'
            });
        })
        .then(session => {
            res.render('shop/checkout', {
                path: '/checkout',
                pageTitle: 'Checkout',
                products: products,
                totalSum: total,
                sessionId: session.id
            });
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    //Only 'Authorised' user should be allowed to download
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found.'));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'));
            }

            const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceName);

            //Readable stream
            const pdfDoc = new PDFDocument();

            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.text('---------------------------');
            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice = totalPrice + prod.quantity * prod.product.price;
                pdfDoc
                    .fontSize(14)
                    .text(prod.product.title + ' - ' + prod.quantity + ' x ' + '$' + prod.product.price);
            });
            pdfDoc.text('---');
            pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

            //Done writing stream
            pdfDoc.end();

            //Retrieve files using node's file system
            //Not the efficient way as it will read files in memory
            // fs.readFile(invoicePath, (err, data) => {
            //     //data will be in the form of a buffer
            //     if (err) {
            //         //default error handling function will take over
            //         next(err);
            //     }
            //     res.setHeader('Content-Type', 'application/pdf');
            //     //Allow us to define how content should be served, inline/attachment here
            //     res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"');

            //     // res.setHeader('Content-Disposition', 'attachment; filename="' + fileName + '"');
            //     res.send(data);
            // })

            // Piping output from readable to the writable stream. Res is the writable stream
            // const file = fs.createReadStream(invoicePath);
            // res.setHeader('Content-Type', 'application/pdf');
            // res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
            // file.pipe(res);
        })
        .catch(err => next(err));
}