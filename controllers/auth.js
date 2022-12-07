const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator/check');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg
        })
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
            return transporter.sendMail({
                to: email,
                from: 's.kharsia@gmail.com',
                subject: 'Signup succeeded!',
                html: '<h1>You successfully signed up!</h1>'
            });
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

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, Buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = Buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found!');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                console.log('http://localhost:3000/reset/' + token);
                transporter.sendMail({
                    to: req.body.email,
                    from: 'sourabhkhs23@gmail.com',
                    subject: 'Password reset',
                    html:
                        `
                    <p> You requested password reset </p>
                    <P> Click this <a href="http://localhost:3000/reset/${token}"></a>link to set a new password </p>
                `
                });
            })
            .catch(err => {
                console.log(err);
            })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {

            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            }
            else {
                message = null;
            }

            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postNewPassword = (req, res, next) => {
    const NewPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(NewPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        })
}