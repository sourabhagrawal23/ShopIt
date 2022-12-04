const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {

    // const isLoggedIn = req
    // .get('Cookie')
    // .split(';')[0]
    // .trim()
    // .split('=')[1] === 'true';

    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
};


exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    })
}

exports.postLogin = (req, res, next) => {
    // res.isLoggedIn = true;
    // res.setHeader('Set-Cookie', 'loggedIn=true');

    const email = req.body.email;
    const password = req.body.password;
    // User.findById('637b8ce105699be0c5cf7817')
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.')
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password).then(
                doMatch => {
                    console.log(doMatch)
                    if (doMatch) {
                        // if doMatch is true, passwords are equal
                        req.session.user = user;
                        req.session.isLoggedIn = true;

                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect('/');
                        })
                    }
                    req.flash('error', 'Invalid email or password.')
                    res.redirect('/login');
                }
            ).catch(err => {
                res.redirect('/login');
            })
        })
        .catch(err => { console.log(err) });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(
            userDoc => {
                if (userDoc) {
                    req.flash('error', 'E-mail already exists, please pick a different one')
                    return res.redirect('/signup')
                }
                return bcrypt.hash(password, 12)
                    .then(hashedPassword => {
                        const user = new User({
                            email: email,
                            password: hashedPassword,
                            cart: { items: [] }
                        })
                        return user.save();
                    })
                    .then(result => {
                        res.redirect('/login');
                    })
            })
        .catch(err => {
            console.log(err);
        })
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
};