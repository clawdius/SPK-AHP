const express = require('express');
const app = express();
const router = express.Router();

const auth = require('../config-app/config-auth')

const controller = require('../controller/controller-login')

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
        .get(auth.roleCheck(await allowed()), function(req, res) {
            res.render('hal_aplikasi/pembukalowongan/hal_pembukalowongan', {
                user: req.user,
                sidebar: 'bukalowongan'
            });
        });

    router.route('/peserta')
        .get(auth.roleCheck(await allowed()), function(req, res) {
            res.render('hal_aplikasi/peserta/hal_peserta', {
                user: req.user,
                sidebar: 'peserta'
            });
        });

    router.route('/laporan')
        .get(auth.roleCheck(await allowed()), function(req, res) {
            res.render('hal_aplikasi/laporan/hal_laporan', {
                user: req.user,
                sidebar: 'laporan'
            });
        });

})

module.exports = router;