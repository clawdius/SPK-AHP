const express = require('express');
const passport = require('passport');
const uploader = require('../config-app/config-uploader');
const router = express.Router();

const controller_calonkry = require('../controller/controller-calonkry')
const controller_global = require('../controller/controller-global')


router.route('/home')
    .get(async function(req, res) {

        let detailCal = await controller_calonkry.getDetailCalon(req.user.idCalon);

        if (detailCal.STAT_KELENGKAPAN == 2) {
            res.render('hal_aplikasi/home_calon/hal_home_acc', {
                user: req.user,
                sidebar: 'home',
                available: await controller_calonkry.getAvailableLowongan(),
                selectedJob: await controller_calonkry.getSelectedJob(req.user.idCalon),
                allow: await controller_calonkry.allowedLowongan(req.user.idCalon)
            })
        } else {
            res.render('hal_aplikasi/home_calon/hal_home_calon', {
                user: req.user,
                sidebar: 'home',
                detail: detailCal
            });
        }
    });

router.route('/pilihlowongan/:idRekrut')
    .get(async function(req, res) {
        await controller_calonkry.selectLowongan(req.user.idCalon, req.params.idRekrut);
        res.redirect('/home');
    })

router.route('/batalpilihlowongan/:idAktivitas')
    .get(async function(req, res) {
        try {
            await controller_calonkry.cancelLowongan(req.user.idCalon, req.params.idAktivitas);
            res.redirect('/home');
        } catch (error) {
            res.redirect('/home?message=notAllowed');
        }
    })

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
    .post(uploader.fields([{ name: 'foto_ktp' }, { name: 'foto_ijazah' }, { name: 'cv' }, { name: 'skck' }]), async function(req, res) {
        await controller_calonkry.updateDataCalon(req.body, req.user.idCalon);
        res.redirect('/home');
    })

module.exports = router;