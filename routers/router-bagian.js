const express = require('express');
const app = express();
const router = express.Router();

const auth = require('../config-app/config-auth')

const controller = require('../controller/controller-login')

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
        .get(auth.roleCheck(await allowed()), function(req, res) {
            res.render('hal_aplikasi/entrybobot/hal_entrybobot', {
                user: req.user,
                sidebar: 'entrybobot'
            });
        });

})

module.exports = router;