const express = require('express');
const app = express();
const router = express.Router();

const auth = require('../config-app/config-auth')

const controller = require('../controller/controller-login')
const controller_bagian = require('../controller/controller-bagian')

//List Router yang boleh dipake bagian
router.group([auth.authChecker], async router => {

    //ngelist yang boleh masuk
    async function allowed() {
        const db = require('../config-app/config-db');
        let allow = [];
        let result = await db.promise().query('SELECT ID_BAGIAN FROM MASTER_BAGIAN WHERE ID_BAGIAN NOT LIKE 1');
        for (i = 0; i < result[0].length; i++) {
            allow.push(Object.values(result[0][i]));
        }
        return allow.flat();
    }

    router.route('/entrybobot')
        .get(auth.roleCheck(await allowed()), async function(req, res) {

            try {
                let check = await controller_bagian.getActiveRekrutmen(req.user.idKaryawan);

                res.render('hal_aplikasi/entrybobot/hal_entrybobot', {
                    user: req.user,
                    sidebar: 'entrybobot'
                });
            } catch (error) {
                res.render('hal_aplikasi/blm_bukaLowongan/hal_blmbukaLowongan', {
                    user: req.user,
                    sidebar: 'entrybobot'
                });
            }

        });

    router.route('/entrykriteria')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            try {
                let check = await controller_bagian.getActiveRekrutmen(req.user.idKaryawan);

                res.render('hal_aplikasi/entrykriteria/hal_entrykriteria', {
                    user: req.user,
                    mKriteria: await controller_bagian.getMasterKriteria(req.user.idKaryawan),
                    bKriteria: await controller_bagian.getBagianKriteria(req.user.idKaryawan),
                    sidebar: 'entrykriteria'
                });
            } catch (error) {
                res.render('hal_aplikasi/blm_bukaLowongan/hal_blmbukaLowongan', {
                    user: req.user,
                    sidebar: 'entrykriteria'
                });
            }

        })
        .post(auth.roleCheck(await allowed()), async function(req, res) {
            await controller_bagian.addKriteriaBagian(req.body, req.user.idKaryawan);
            res.redirect('/entrykriteria');
        })

    router.route('/entrykriteria/hapus/:id')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            await controller_bagian.deleteKriteriaBagian(req.params.id, req.user.idKaryawan);
            res.redirect('/entrykriteria')
        })

})

module.exports = router;