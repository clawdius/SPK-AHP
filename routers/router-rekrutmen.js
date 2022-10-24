const express = require('express');
const app = express();
const router = express.Router();

const auth = require('../config-app/config-auth')

const controller_rekrutmen = require('../controller/controller-rekrutmen');
const controller_global = require('../controller/controller-global');

//List Router yang boleh dipake rekrutmen
router.group([auth.authChecker], async router => {

    async function allowed() {
        const db = require('../config-app/config-db');
        let allow = [];
        let result = await db.promise().query('SELECT ID_BAGIAN FROM MASTER_BAGIAN WHERE ID_BAGIAN LIKE 1');
        for (i = 0; i < result[0].length; i++) {
            allow.push(Object.values(result[0][i]));
        }
        return allow.flat();
    }

    router.route('/bukalowongan')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            res.render('hal_aplikasi/pembukalowongan/hal_pembukalowongan', {
                user: req.user,
                daftarBagian: await controller_rekrutmen.daftarBagian(),
                sidebar: 'bukalowongan'
            });
        });

    router.route('/bukalowongan/tambah/:IDBAGIAN')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            res.render('hal_aplikasi/pembukalowongan/tambahlowongan/hal_tambahlowongan', {
                user: req.user,
                daftarKar: await controller_rekrutmen.karyawanBagian(req.params.IDBAGIAN),
                detailBagian: await controller_rekrutmen.detailBagian(req.params.IDBAGIAN),
                dateNow: controller_global.findToday(),
                sidebar: 'bukalowongan'
            });
        })
        .post(auth.roleCheck(await allowed()), async function(req, res) {
            await controller_rekrutmen.tambahRekrutmen(req.body);
            res.redirect('/bukalowongan');
        });

    router.route('/peserta')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            res.render('hal_aplikasi/peserta/hal_peserta', {
                user: req.user,
                calonKar: await controller_rekrutmen.calonKaryawan(),
                sidebar: 'peserta'
            });
        });

    router.route('/peserta/review/:idCalon')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            res.render('hal_aplikasi/peserta/reviewpeserta/hal_reviewpeserta', {
                user: req.user,
                sidebar: 'peserta',
                calonKar: await controller_rekrutmen.detailCalonKaryawan(req.params.idCalon)
            })
        }).post(auth.roleCheck(await allowed()), async function(req, res) {
            await controller_rekrutmen.changeMBR(req.params.idCalon, req.body.statusMBR);
            res.redirect('/peserta/review/' + req.params.idCalon)
        })

    router.route('/peserta/review/:idCalon/:action')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            await controller_rekrutmen.changeStatusCalonKaryawan(req.params.idCalon, req.params.action),
                res.redirect('/peserta');
        })

    router.route('/laporan')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            res.render('hal_aplikasi/laporan/hal_laporan', {
                user: req.user,
                sidebar: 'laporan',
                listLap: await controller_rekrutmen.getLaporanFinished()
            });
        });

    router.route('/laporan/getlaporan')
        .post(auth.roleCheck(await allowed()), async function(req, res) {
            res.render('hal_aplikasi/laporan/ajax_table', {
                listCalon: await controller_rekrutmen.getDetailLaporan(req.body.idLap)
            })
        })

})

module.exports = router;