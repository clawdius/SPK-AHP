const db = require('../config-app/config-db')

async function daftarBagian() {
    let query = "SELECT *, CASE WHEN ID_BAGIAN IN (SELECT mb.ID_BAGIAN FROM master_bagian mb JOIN master_rekrutmen mr ON mb.ID_BAGIAN = mr.ID_BAGIAN WHERE mr.STAT_REKRUTMEN IN (1, 0)) THEN 1 ELSE 0 END AS STATUS FROM master_bagian WHERE ID_BAGIAN != 1";
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

async function calonKaryawan() {
    let query = "SELECT * FROM MASTER_CALON_KARYAWAN ORDER BY STAT_KELENGKAPAN ASC, STAT_TES ASC, NAMA_CALON ASC;";
    let res = await db.promise().query(query);
    return res[0];
}

async function detailCalonKaryawan(IDCALON) {
    let query = "SELECT * FROM MASTER_CALON_KARYAWAN " +
        "WHERE ID_CALON = ?";
    let res = await db.promise().query(query, IDCALON);
    return res[0][0];
}

async function changeStatusCalonKaryawan(IDCALON, STATUS) {

    let status;

    switch (STATUS) {
        case 'pending':
            status = 1
            break;
        case 'accept':
            status = 2
            break;
    }

    let query = "UPDATE MASTER_CALON_KARYAWAN SET STAT_KELENGKAPAN = ? " +
        "WHERE ID_CALON = ?"

    let res = await db.promise().query(query, [status, IDCALON])

    return res[0];
}

async function changeMBR(IDCALON, MBR) {
    let query = "UPDATE MASTER_CALON_KARYAWAN SET STAT_MBR = ? " +
        "WHERE ID_CALON = ?"

    let res = await db.promise().query(query, [MBR, IDCALON])
}

async function tambahRekrutmen(data) {

    let dataRefactored = [
        data.idBagian,
        data.karyawanDaftar,
        data.operatorId,
        data.tanggalPend1,
        data.tanggalPend2,
        data.tanggalTes,
        data.posisi,
        0
    ];

    let query = "INSERT INTO MASTER_REKRUTMEN" +
        "(ID_BAGIAN, ID_KARYAWAN, OPERATOR, TGL_MULAI, TGL_SELESAI, TGL_TES, POSISI, STAT_REKRUTMEN) VALUES" +
        "(?, ?, ?, ?, ?, ?, ?, ?)"
    let res = await db.promise().query(query, dataRefactored)

    return res[0];
}

async function getLaporanFinished() {
    let query = "SELECT MR.*, MB.NAMA_BAGIAN FROM MASTER_REKRUTMEN MR " +
        "JOIN MASTER_BAGIAN MB ON MR.ID_BAGIAN = MB.ID_BAGIAN " +
        "WHERE STAT_REKRUTMEN = 2";

    let res = await db.promise().query(query);

    return res[0];
}

async function getDetailLaporan(idLap) {
    let query = "SELECT * FROM AKTIVITAS_REKRUTMEN AR " +
        "JOIN MASTER_CALON_KARYAWAN MCK ON AR.ID_CALON = MCK.ID_CALON " +
        "WHERE AR.ID_REKRUTMEN = ?"

    let res = await db.promise().query(query, idLap)

    return res[0];
}


module.exports = {
    daftarBagian,
    detailBagian,
    karyawanBagian,
    tambahRekrutmen,
    calonKaryawan,
    detailCalonKaryawan,
    changeStatusCalonKaryawan,
    changeMBR,
    getLaporanFinished,
    getDetailLaporan
}