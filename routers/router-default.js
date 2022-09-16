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
                message: req.query.message == 'noLogin' ? 'Silahkan Login Dahulu' : req.query.message == 'wrongCred' ? 'User Tidak Ditemukan' : ''
            })
        } else {
            res.redirect('/home')
        }
    })
    .post(passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login?message=wrongCred'
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
            if (req.user.idBagian == 1) {
                res.render('home/rekrutmen/home', {
                    user: req.user,
                    sidebar: 'home'
                });
            } else {
                res.redirect('/entrybobot');
            }
        });

    router.route('/dashboard')
        .get(function(req, res) {
            res.render('home/rekrutmen/dashboard', {
                user: req.user,
                sidebar: 'dashboard'
            });
        });

    router.route('/entrybobot')
        .get(function(req, res) {
            res.render('home/hrd/entrybobot', {
                user: req.user,
                sidebar: 'entrybobot'
            });
        });

})



module.exports = router;