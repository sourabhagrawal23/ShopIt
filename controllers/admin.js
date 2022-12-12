const Product = require('../models/product');
const { validationResult } = require('express-validator/check');
const mongoose = require('mongoose');
const fileHelper = require('../util/file');

exports.getAddProduct = (req, res, next) => {
    //send method automatically sets content type to HTML
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))

    // if (!req.session.isLoggedIn) {
    //     res.redirect('/login');
    // }

    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
};


exports.postAddProduct = (req, res, next) => {
    // products.push({ title: req.body.title });
    // console.log(req.body);
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    if (!image) {
        console.log("image error");
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: 'Attached file is not an image.',
            validationErrors: []
        })
    }
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("error is not empty")
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                // imageUrl: imageUrl,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    const imageUrl = image.path;

    // const product = new Product(title,price,description,imageUrl, null, req.user._id);
    const product = new Product({
        // _id: new mongoose.Types.ObjectId('637cc8e9c08edde69874084e'),
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user._id
    });
    product
        .save()
        .then((result) => {
            console.log('Created product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        })
};

exports.getEditProduct = (req, res, next) => {
    //send method automatically sets content type to HTML
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    // req.user
    // .getProducts({ id: prodId })
    // Product.findByPk(prodId)
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: true,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        })
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    // file extracted by multer
    const image = req.file;
    const updatedDesc = req.body.description;

    // Old way of saving product
    // const updatedProduct = new Product(
    //   prodId,
    //   updatedTitle,
    //   updatedImageUrl,
    //   updatedDesc,
    //   updatedPrice
    // );

    // Raw MongoDB
    // const product = new Product(
    //     updatedTitle,
    //     updatedPrice,
    //     updatedDesc,
    //     updatedImageUrl,
    //     prodId
    // );

    // Product.findById(prodId)
    // .then(product => {
    //     product.title = updatedTitle;
    //     product.price = updatedPrice;
    //     product.description = updatedDesc;
    //     product.imageUrl = updatedImageUrl;
    //     return product.save();
    // })

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                // imageUrl: updatedImageUrl,
                price: updatedPrice,
                description: updatedDesc,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    Product.findById(prodId).then(product => {
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }

        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        if (image) {
            fileHelper.deleteFile(product.imageUrl);
            product.imageUrl = image.path;
        }
        return product
            .save()
            .then(result => {
                res.redirect('/admin/products');
                console.log('UPDATED PRODUCT');
            })
    })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProducts = (req, res, next) => {
    // Product.fetchAll( products => {
    //     res.render('admin/products', { prods: products, pageTitle: 'Admin Products', path: '/admin/products' });
    // });

    // Product.findAll()
    // req.user.getProducts()
    Product.find({ userId: req.user._id })
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    // Product.deleteById(prodId);
    // Product.findByIdAndRemove(prodId)
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return next(new Error('Product not found!'))
            }
            fileHelper.deleteFile(product.imageUrl);
            return Product.deleteOne({ _id: prodId, userId: req.user._id });
        })
        .then(() => {
            res.redirect('/admin/products');
            console.log("DESTROYED PRODUCT");
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
};
