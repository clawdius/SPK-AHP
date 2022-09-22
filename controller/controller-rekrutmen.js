const db = require('../config-app/config-db')

async function daftarBagian() {
    let query = "SELECT * FROM MASTER_BAGIAN";
    let res = await db.promise().query(query)
    return res[0];
}

async function detailBagian(IDBAGIAN) {
    let query = "SELECT * FROM MASTER_BAGIAN WHERE ID_BAGIAN = ?";
    let res = await db.promise().query(query, IDBAGIAN)
    return res[0][0];
}

async function karyawanBagian(IDBAGIAN) {
    let query = "SELECT * FROM MASTER_KARYAWAN WHERE ID_BAGIAN = ?";
    let res = await db.promise().query(query, IDBAGIAN);
    return res[0];
}

async function tambahRekrutmen(data) {

    let dataRefactored = [
        data.idBagian,
        data.karyawanDaftar,
        data.operatorId,
        data.tanggalPend1,
        data.tanggalPend2,
        data.tanggalTes,
        0
    ];

    let query = "INSERT INTO MASTER_REKRUTMEN" +
        "(ID_BAGIAN, ID_KARYAWAN, OPERATOR, TGL_MULAI, TGL_SELESAI, TGL_TES, STAT_REKRUTMEN) VALUES" +
        "(?, ?, ?, ?, ?, ?, ?)"
    let res = await db.promise().query(query, dataRefactored)

    return res[0];
}

module.exports = {
    daftarBagian,
    detailBagian,
    karyawanBagian,
    tambahRekrutmen
}