const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    //send method automatically sets content type to HTML
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render('admin/edit-product', {pageTitle: 'Add Product', path: '/admin/add-product', editing: false})
};


exports.postAddProduct = (req,res,next) => {
    // products.push({ title: req.body.title });
    // console.log(req.body);

    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title,price,description,imageUrl);

    product
    .save()
    .then((result)=> {
        console.log('Created product');
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    })
};

// exports.getEditProduct = (req, res, next) => {
//     //send method automatically sets content type to HTML
//     // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
//     const editMode = req.query.edit;
//     if(!editMode){
//         return res.redirect('/');
//     }
//     const prodId = req.params.productId;
//     req.user
//     .getProducts({ id: prodId })
//     // Product.findByPk(prodId)
//     .then(products => {
//         const product = products[0];
//         if(!product)
//         {
//             return res.redirect('/');
//         }
//         res.render('admin/edit-product', {pageTitle: 'Edit Product', path: '/admin/edit-product', editing:true, product:product})
//     });
// };

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    
    // Old way of saving product
    // const updatedProduct = new Product(
    //   prodId,
    //   updatedTitle,
    //   updatedImageUrl,
    //   updatedDesc,
    //   updatedPrice
    // );

    Product.findByPk(prodId)
    .then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imageUrl = updatedImageUrl;
        return product.save();
    })
    .then(result => {
        res.redirect('/admin/products');
        console.log('UPDATED PRODUCT');
    })
    .catch(err => console.log(err));
  };

exports.getProducts = (req,res,next) => {
    // Product.fetchAll( products => {
    //     res.render('admin/products', { prods: products, pageTitle: 'Admin Products', path: '/admin/products' });
    // });

    // Product.findAll()
    req.user.getProducts()
    .then( products => {
        res.render('admin/products', { prods: products, pageTitle: 'Admin Products', path: '/admin/products' });
    })
    .catch(err => console.log(err));
};

// exports.postDeleteProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     // Product.deleteById(prodId);
//     Product.findByPk(prodId)
//     .then(product => {
//         return product.destroy();
//     })
//     .then(result => {
//         res.redirect('/admin/products');
//         console.log("DESTROYED PRODUCT");
//     })
//     .catch(err => console.log(err));
//   };
  