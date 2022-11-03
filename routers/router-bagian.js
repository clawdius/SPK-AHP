const express = require('express');
const app = express();
const router = express.Router();

const auth = require('../config-app/config-auth')

const controller_global = require('../controller/controller-global')
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

    router.route('/entrykriteria')
        .get(auth.roleCheck(await allowed()), async function(req, res) {

            try {
                await controller_bagian.getActiveRekrutmen(req.user.idKaryawan);

                res.render('hal_aplikasi/entrykriteria/hal_entrykriteria', {
                    user: req.user,
                    mKriteria: await controller_bagian.getMasterKriteria(req.user.idKaryawan),
                    bKriteria: await controller_bagian.getBagianKriteria(req.user.idKaryawan),
                    status: await controller_bagian.getStatusRekrutmen(req.user.idKaryawan),
                    sidebar: 'entrykriteria'
                });
            } catch (error) {
                res.render('hal_aplikasi/blm_bukaLowongan/hal_error', {
                    user: req.user,
                    sidebar: 'entrykriteria',
                    message: 'Lowongan belum tersedia!'
                });
            }
        })
        .post(auth.roleCheck(await allowed()), async function(req, res) {
            await controller_bagian.addKriteriaBagian(req.body, req.user.idKaryawan);
            res.redirect('/entrykriteria');
        })

    router.route('/tambahkriteria')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            try {
                await controller_bagian.getActiveRekrutmen(req.user.idKaryawan);

                res.render('hal_aplikasi/tambahkriteria/hal_tambahkriteria', {
                    user: req.user,
                    sidebar: 'entrykriteria'
                });
            } catch (error) {
                res.render('hal_aplikasi/blm_bukaLowongan/hal_error', {
                    user: req.user,
                    sidebar: 'entrykriteria',
                    message: 'Lowongan belum tersedia!'
                });
            }
        })
        .post(auth.roleCheck(await allowed()), async function(req, res) {
            await controller_bagian.tambahKriteria(req.body);
            res.redirect('/entrykriteria')
        })

    router.route('/editkriteria/:id')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            try {
                await controller_bagian.getActiveRekrutmen(req.user.idKaryawan);

                res.render('hal_aplikasi/editkriteria/hal_editkriteria', {
                    user: req.user,
                    sidebar: 'entrykriteria',
                    kriteria: await controller_bagian.getKriteria(req.params.id)
                });
            } catch (error) {
                console.log(error);
                res.render('hal_aplikasi/blm_bukaLowongan/hal_error', {
                    user: req.user,
                    sidebar: 'entrykriteria',
                    message: 'Lowongan belum tersedia!'
                });
            }
        })
        .post(auth.roleCheck(await allowed()), async function(req, res) {
            await controller_bagian.setKriteria(req.params.id, req.body.keteranganKriteria);

            res.redirect('/entrykriteria');
        })

    router.route('/entrykriteria/hapus/:id')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            await controller_bagian.deleteKriteriaBagian(req.params.id, req.user.idKaryawan);
            res.redirect('/entrykriteria');
        })

    router.route('/entrybobot')
        .get(auth.roleCheck(await allowed()), async function(req, res) {

            try {
                await controller_bagian.getActiveRekrutmen(req.user.idKaryawan);
                let check = await controller_bagian.getBagianKriteria(req.user.idKaryawan);
                check[0].BOBOT;
                res.render('hal_aplikasi/entrybobot/hal_entrybobot', {
                    user: req.user,
                    bKriteria: await controller_bagian.getBagianKriteria(req.user.idKaryawan),
                    status: await controller_bagian.getStatusRekrutmen(req.user.idKaryawan),
                    sidebar: 'entrybobot'
                });
            } catch (error) {
                res.render('hal_aplikasi/blm_bukaLowongan/hal_error', {
                    user: req.user,
                    sidebar: 'entrybobot',
                    message: 'Silahkan pilih kriteria terlebih dahulu!'
                });
            }

        })
        .post(auth.roleCheck(await allowed()), async function(req, res) {

            await controller_bagian.updateBobot(req.body, req.user.idKaryawan);
            res.redirect('/entrybobot');

        })

    router.route('/rekomendasi')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            try {
                let nilai = await controller_bagian.getListNilai(req.user.idBagian);
                let bobot = await controller_bagian.getBagianKriteria(req.user.idKaryawan);
                let rekomendasi = await controller_global.hitungRekomendasi(nilai, bobot);
                if (nilai[0].NILAI == null) {
                    res.render('hal_aplikasi/blm_bukaLowongan/hal_error', {
                        user: req.user,
                        sidebar: 'rekomendasi',
                        message: 'Nilai belum dimasukkan!'
                    });
                } else {
                    res.render('hal_aplikasi/rekomendasi/hal_rekomendasi', {
                        user: req.user,
                        sidebar: 'rekomendasi',
                        rekomendasi: rekomendasi
                    });
                };
            } catch (error) {
                res.render('hal_aplikasi/blm_bukaLowongan/hal_error', {
                    user: req.user,
                    sidebar: 'rekomendasi',
                    message: 'Nilai belum dimasukkan!'
                });
            }
        })

    router.route('/rekomendasi/tutup')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            let idRekrut = await controller_bagian.getActiveRekrutmen(req.user.idKaryawan);

            await controller_bagian.closePeriod(idRekrut);

            res.redirect('/laporanbag');
        })

    router.route('/entrynilai')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            try {
                await controller_bagian.getActiveRekrutmen(req.user.idKaryawan);

                if (await controller_bagian.finishedSubmit(req.user.idBagian) == 'allowed') {
                    res.render('hal_aplikasi/entrynilai/hal_entrynilai', {
                        user: req.user,
                        sidebar: 'entrynilai',
                        calonKar: await controller_bagian.getListCalonKar(req.user.idBagian),
                        bKriteria: await controller_bagian.getBagianKriteria(req.user.idKaryawan),
                        stat: await controller_bagian.finishedSubmit(req.user.idBagian),
                        listNilai: [{ 'NILAI': null }]
                    });
                } else {
                    res.render('hal_aplikasi/entrynilai/hal_entrynilai', {
                        user: req.user,
                        sidebar: 'entrynilai',
                        calonKar: await controller_bagian.getListCalonKar(req.user.idBagian),
                        bKriteria: await controller_bagian.getBagianKriteria(req.user.idKaryawan),
                        listNilai: await controller_bagian.getListNilai(req.user.idBagian),
                        stat: await controller_bagian.finishedSubmit(req.user.idBagian)
                    });
                }

            } catch (error) {
                res.render('hal_aplikasi/blm_bukaLowongan/hal_error', {
                    user: req.user,
                    sidebar: 'entrynilai',
                    message: 'Belum ada pendaftar!'
                });
            }

        })
        .post(auth.roleCheck(await allowed()), async function(req, res) {
            try {
                await controller_bagian.submitNilai(req.body)
                res.redirect('/entrynilai')
            } catch (e) {
                res.redirect('/entrynilai')
            }
        })

    router.route('/entrynilai/updatenilai')
        .post(auth.roleCheck(await allowed()), async function(req, res) {
            await controller_bagian.updateNilai(req.body);
            res.redirect('/entrynilai');
        })

    router.route('/laporanbag')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            res.render('hal_aplikasi/laporanbag/hal_laporanbag', {
                user: req.user,
                sidebar: 'laporan',
                listPer: await controller_bagian.getListRekrutmen(req.user.idKaryawan)
            })
        });

    router.route('/laporanbag/getriwayat')
        .post(async function(req, res) {
            let skorKriteria = await controller_bagian.getLaporanPeriode(req.body.idRek);

            res.render('hal_aplikasi/laporanbag/ajax_table', {
                rank: await controller_global.hitungRekomendasi(skorKriteria[0], skorKriteria[1]),
                idRek: skorKriteria[2]
            })
        })

    router.route('/laporanbag/getriwayat/print/:id')
        .get(async function(req, res) {
            let skorKriteria = await controller_bagian.getLaporanPeriode(req.params.id);

            res.render('hal_aplikasi/laporanbag/print', {
                rank: await controller_global.hitungRekomendasi(skorKriteria[0], skorKriteria[1])
            })
        })
})

module.exports = router;