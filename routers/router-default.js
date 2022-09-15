const e = require('express');
const express = require('express');
const passport = require('passport');
const router = express.Router();

const auth = require('../config-app/config-auth')

const controller = require('../controller/controller-login')

//Group Router
require('express-router-group');

router.route('/')
    .get(function(req, res) {
        res.redirect('/login')
    })

router.route('/login')
    .get(function(req, res) {
        if (!req.isAuthenticated()) {
            res.render('login/hal_login', {
                message: ''
            })
        } else {
            res.redirect('/home')
        }
    })
    .post(passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login'
    }));

router.route('/logout')
    .get(function(req, res) {
        req.logout(function() {
            req.session.destroy(function(err) {
                res.redirect('/')
            })
        })
    })

router.group(auth.authChecker, router => {

    router.route('/home')
        .get(function(req, res) {
            res.send(req.user);
        });

})



module.exports = router;