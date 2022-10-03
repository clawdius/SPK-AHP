const express = require('express');
const app = express();
const passport = require('passport');
const router = express.Router();

const fs = require('fs')

const uploader = require('../config-app/config-uploader')
const auth = require('../config-app/config-auth')

//Controller yang dipakai
const controller_register = require('../controller/controller-register');
const controller_global = require('../controller/controller-global');

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
            if (req.user.idBagian) {
                switch (req.user.idBagian) {
                    case 1:
                        res.redirect('/bukalowongan');
                        break;
                    default:
                        res.redirect('/entrykriteria');
                        break;
                }
            } else {
                res.redirect('/home');
            }
        }
    })
    .post(passport.authenticate('karyawan-local', {
        successRedirect: '/login',
        failureRedirect: '/login?message=wrongCred'
    }));

router.route('/logout')
    .get(function(req, res) {
        if (req.user.idBagian) {
            req.logout(function() {
                req.session.destroy(function(err) {
                    res.redirect('/login');
                })
            })
        } else {
            req.logout(function() {
                req.session.destroy(function(err) {
                    res.redirect('/logincalon');
                })
            })
        };
    })

router.route('/logincalon')
    .get(function(req, res) {
        if (!req.isAuthenticated()) {
            res.render('hal_aplikasi/masuk_calon/hal_masuk_calon');
        } else {
            if (req.user.idBagian) {
                switch (req.user.idBagian) {
                    case 1:
                        res.redirect('/bukalowongan');
                        break;
                    default:
                        res.redirect('/entrykriteria');
                        break;
                }
            } else {
                res.redirect('/home');
            }
        }
    })
    .post(passport.authenticate('calon-local', {
        successRedirect: '/home',
        failureRedirect: '/logincalon?message=wrongCred'
    }));

router.route('/registercalon')
    .get(function(req, res) {
        res.render('hal_aplikasi/isi_dataCalon/hal_isi_dataCalon', {
            tgl_max: controller_global.findToday(),
            thn_max: controller_global.findYear()
        })
    })
    .post(uploader.single('foto_ktp'), async function(req, res) {
        insertedId = await controller_register.daftarBaru(req.body);
        passport.authenticate('calon-local')(req, res, function() {
            res.redirect('/logincalon');
        });
    });

router.route('/check/NIK')
    .post(async function(req, res) {
        res.json(await controller_register.checkNIK(req.body.nik))
    })

router.route('/check/EMAIL')
    .post(async function(req, res) {
        res.json(await controller_register.checkEmail(req.body.email))
    })

router.route('/check/NIKedit')
    .post(async function(req, res) {
        res.json(await controller_register.checkNIKedit(req.body))
    })

module.exports = router;