const express = require('express');
const passport = require('passport');
const router = express.Router();


router.route('/home')
    .get(function(req, res) {
        res.render('hal_aplikasi/home_calon/home_calon', {
            user: req.user,
            sidebar: 'home'
        });
    });

module.exports = router;