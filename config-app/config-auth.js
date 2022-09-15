const express = require('express');
const db = require('./config-db')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Validator
passport.use(
    new LocalStrategy({
        usernameField: 'id_pengguna',
        passwordField: 'password_pengguna',
    }, function(username, password, done) {

        let query = "SELECT * FROM MASTER_KARYAWAN WHERE USERNAME = ? AND PASSWORD = ?";
        const credential = [username, password]

        db.query(query, credential, function(req, res) {

            if (res.length == 1) {
                var user = {
                    username: res[0].USERNAME,
                    idKaryawan: res[0].ID_KARYAWAN,
                    idBagian: res[0].ID_BAGIAN
                }

                done(null, user);
            } else {
                done(null, false)
            }

        })

    })
);

passport.serializeUser(function(user, done) {
    return done(null, user);
});

passport.deserializeUser(function(user, done) {
    return done(null, user)
});

function authChecker(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login?message=noLogin');
    }
}

module.exports = {
    authChecker
}