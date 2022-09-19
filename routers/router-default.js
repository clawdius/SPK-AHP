const express = require('express');
const app = express();
const passport = require('passport');
const router = express.Router();

const fs = require('fs')

const uploader = require('../config-app/config-uploader')
const auth = require('../config-app/config-auth')

//Controller yang dipakai
const controller = require('../controller/controller-login');
const controller_register = require('../controller/controller-register');

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
            switch (req.user.idBagian) {
                case 1:
                    res.redirect('/bukalowongan');
                    break;
                default:
                    res.redirect('/entrybobot');
                    break;
            }
        }
    })
    .post(passport.authenticate('local', {
        successRedirect: '/login',
        failureRedirect: '/login?message=wrongCred'
    }));

router.route('/logout')
    .get(function(req, res) {
        req.logout(function() {
            req.session.destroy(function(err) {
                res.redirect('/');
            })
        })
    })

router.route('/logincalon')
    .get(function(req, res) {
        res.render('hal_aplikasi/masuk_calon/hal_masuk_calon');
    });

router.route('/registercalon')
    .get(function(req, res) {
        res.render('hal_aplikasi/isi_dataCalon/hal_isi_dataCalon', {
            tgl_max: controller_register.findToday()
        })
    })
    .post(uploader.single('foto_ktp'), async function(req, res) {
        await controller_register.daftarBaru(req.body);
        res.redirect('/login');
    });

module.exports = router;