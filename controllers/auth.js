const User = require('../models/user');

exports.getLogin = (req, res, next) => {

    // const isLoggedIn = req
    // .get('Cookie')
    // .split(';')[0]
    // .trim()
    // .split('=')[1] === 'true';

    console.log(req.session.isLoggedIn);

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
      });
  };

exports.postLogin = (req, res, next) => {
    // res.isLoggedIn = true;
    // res.setHeader('Set-Cookie', 'loggedIn=true');

    User.findById('637b8ce105699be0c5cf7817')
    .then(user => {
        req.session.user = user;
        req.session.isLoggedIn = true;
        res.redirect('/');
    })
    .catch(err => {console.log(err)});
}


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })   
}