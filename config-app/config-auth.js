const express = require('express');
const db = require('./config-db')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Validator
passport.use('karyawan-local',
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
                    nama: res[0].NAMA_KARYAWAN,
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

passport.use('calon-local',
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, function(username, password, done) {

        let query = "SELECT * FROM MASTER_CALON_KARYAWAN WHERE EMAIL = ? AND PASSWORD = ?";
        const credential = [username, password]

        db.query(query, credential, function(req, res) {


            if (res.length == 1) {
                var user = {
                    email: res[0].EMAIL,
                    nama: res[0].NAMA_CALON,
                    idCalon: res[0].ID_CALON
                }

                done(null, user);
            } else {
                done(null, false)
            }

        })

    })
);

passport.use('calon-local-autoLogin',
    new LocalStrategy({
        usernameField: 'emailCalon',
        passwordField: 'passwordCalon',
    }, function(username, password, done) {

        let query = "SELECT * FROM MASTER_CALON_KARYAWAN WHERE EMAIL = ? AND PASSWORD = ?";
        const credential = [username, password]

        db.query(query, credential, function(req, res) {


            if (res.length == 1) {
                var user = {
                    email: res[0].EMAIL,
                    nama: res[0].NAMA_CALON,
                    idCalon: res[0].ID_CALON
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

//Pengecekan Login apa belum
function authChecker(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login?message=noLogin');
    }
}

//Pengecekan role
function roleCheck(allowed) {
    return function(req, res, next) {
        if (allowed.includes(req.user.idBagian)) {
            next();
        } else {
            res.redirect('/login')
        }
    }
}

module.exports = {
    authChecker,
    roleCheck
}