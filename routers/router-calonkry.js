const express = require('express');
const passport = require('passport');
const uploader = require('../config-app/config-uploader');
const router = express.Router();

const controller_calonkry = require('../controller/controller-calonkry')
const controller_global = require('../controller/controller-global')


router.route('/home')
    .get(async function(req, res) {
        res.render('hal_aplikasi/home_calon/hal_home_calon', {
            user: req.user,
            sidebar: 'home',
            detail: await controller_calonkry.getDetailCalon(req.user.idCalon)
        });
    });

router.route('/profil')
    .get(async function(req, res) {
        res.render('hal_aplikasi/profil_calon/hal_profil_calon', {
            user: req.user,
            tgl_max: controller_global.findToday(),
            thn_max: controller_global.findYear(),
            sidebar: 'home',
            detail: await controller_calonkry.getDetailCalon(req.user.idCalon)
        })
    })
    .post(uploader.single('foto_ktp'), async function(req, res) {
        await controller_calonkry.updateDataCalon(req.body, req.user.idCalon);
        res.redirect('/home');
    })

module.exports = router;