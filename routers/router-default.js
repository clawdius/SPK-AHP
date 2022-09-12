const express = require('express');
const router = express.Router();

const controller = require('../controller/controller-default')

//Group Router
require('express-router-group');

router.route('/danar')
    .get(function(req, res) {
        res.render('hello', {
            hasil: controller.halo()
        });
    })

module.exports = router;