const express = require('express');
const app = express();
const router = express.Router();
const qr = require('qrcode');

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
                        calonKar: await controller_bagian.getListCalonKar(req.user.idBagian),
                        listNilai: await controller_bagian.getListNilai(req.user.idBagian),
                        kriteria_asc: await controller_bagian.getBagianKriteria(req.user.idKaryawan),
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

                // console.log(await controller_bagian.getBagianKriteria(req.user.idKaryawan));

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
                let idRekrut = await controller_bagian.getActiveRekrutmen(req.user.idKaryawan);
                await controller_bagian.submitNilai(req.body, idRekrut);
                res.redirect('/entrynilai');
            } catch (e) {
                console.log(e);
                res.redirect('/entrynilai');
            }
        })

    router.route('/entrynilai/updatenilai')
        .post(auth.roleCheck(await allowed()), async function(req, res) {
            let idRekrut = await controller_bagian.getActiveRekrutmen(req.user.idKaryawan);
            await controller_bagian.updateNilai(req.body, idRekrut);
            res.redirect('/entrynilai');
        })

    router.route('/laporanbag')
        .get(auth.roleCheck(await allowed()), async function(req, res) {
            res.render('hal_aplikasi/laporanbag/hal_laporanbag', {
                user: req.user,
                sidebar: 'laporan',
                listPer: await controller_bagian.getListRekrutmen(req.user.idKaryawan),
                date: await controller_bagian.getDate(req.user.idKaryawan)
            })
        })
        .post(auth.roleCheck(await allowed()), async function(req, res) {
            qr.toDataURL(`${req.user.idKaryawan} | ${req.user.nama} | ${req.user.namaBag}`, async(err, src) => {
                let skorKriteria = await controller_bagian.getLaporanPeriodeRange(req.user.idKaryawan, req.body.start, req.body.end);
                let nilai_arr = [];
                let bobot_arr = [];
                let hasil_arr = [];
                for(let i = 0; i < skorKriteria[2].length; i++) {
                    nilai_arr = [];
                    bobot_arr = [];
                    for (let nilai = 0; nilai < skorKriteria[0].length; nilai++) {
                        if(skorKriteria[2][i] == skorKriteria[0][nilai]['ID_REKRUTMEN']){
                            nilai_arr.push(skorKriteria[0][nilai]);
                        }
                    }
                    for (let bobot = 0; bobot < skorKriteria[1].length; bobot++) {
                        if(skorKriteria[2][i] == skorKriteria[1][bobot]['ID_REKRUTMEN']){
                            bobot_arr.push(skorKriteria[1][bobot]);
                        }
                    }
                    hasil_arr.push(await controller_global.hitungRekomendasi(nilai_arr, bobot_arr));
                }
                let bagian = await controller_bagian.getInclBagian(skorKriteria[2]);
                res.render('hal_aplikasi/laporanbag/print_laporanRange', {
                    user: req.user,
                    tgl: { START: req.body.start, END: req.body.end },
                    rank: hasil_arr,
                    bagian: bagian,
                    src
                })
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

            let bagian = await controller_bagian.getInclBagian(skorKriteria[2]);
            qr.toDataURL(`${req.user.idKaryawan} | ${req.user.nama} | ${req.user.namaBag}`, async(err, src) => {
                res.render('hal_aplikasi/laporanbag/print', {
                    user: req.user,
                    rank: await controller_global.hitungRekomendasi(skorKriteria[0], skorKriteria[1]),
                    bagian: bagian,
                    src
                })
            })
        })
})

module.exports = router;