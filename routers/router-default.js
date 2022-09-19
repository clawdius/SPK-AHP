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
            res.redirect('/pembukalowongan')
        }
    })
    .post(passport.authenticate('local', {
        successRedirect: '/pembukalowongan',
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

    router.route('/pembukalowongan')
        .get(function(req, res) {
            if (req.user.idBagian == 1) {
                res.render('hal_aplikasi/pembukalowongan/hal_pembukalowongan', {
                    user: req.user,
                    sidebar: 'pembukalowongan'
                });
            } else {
                res.redirect('/entrybobot');
            }
        });

    router.route('/peserta')
        .get(function(req, res) {
            res.render('hal_aplikasi/peserta/hal_peserta', {
                user: req.user,
                sidebar: 'peserta'
            });
        });
    
    router.route('/laporan')
        .get(function(req, res) {
            res.render('hal_aplikasi/laporan/hal_laporan', {
                user: req.user,
                sidebar: 'laporan'
            });
        });

    router.route('/entrybobot')
        .get(function(req, res) {
            res.render('hal_aplikasi/entrybobot/hal_entrybobot', {
                user: req.user,
                sidebar: 'entrybobot'
            });
        });

})



module.exports = router;