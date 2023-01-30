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
        "WHERE STAT_REKRUTMEN = ?";

    let res = await db.promise().query(query, 2);

    return res[0];
}

async function getdateHistory() {
    let query = "SELECT MIN(TGL_MULAI) AS MIN, MAX(TGL_SELESAI) AS MAX " +
        "FROM `master_rekrutmen` WHERE STAT_REKRUTMEN = ?";

    let res = await db.promise().query(query, 2);

    return res[0];
}

async function getDetailLaporan(idLap) {
    let query = "SELECT * FROM AKTIVITAS_REKRUTMEN AR " +
        "JOIN MASTER_CALON_KARYAWAN MCK ON AR.ID_CALON = MCK.ID_CALON " +
        "WHERE AR.ID_REKRUTMEN = ?";

    let res = await db.promise().query(query, idLap);

    return res[0];
}

async function getDetailLaporanRange(idRek) {
    let query = "SELECT MCK.NAMA_CALON, MCK.EMAIL, AR.TGL_DAFTAR, AR.ID_REKRUTMEN, MR.TGL_MULAI FROM AKTIVITAS_REKRUTMEN AR " +
        "JOIN MASTER_CALON_KARYAWAN MCK ON AR.ID_CALON = MCK.ID_CALON " +
        "JOIN MASTER_REKRUTMEN MR ON MR.ID_REKRUTMEN = AR.ID_REKRUTMEN " +
        "WHERE AR.ID_REKRUTMEN IN (?) " +
        "ORDER BY AR.ID_REKRUTMEN, MCK.NAMA_CALON";

    let id = [];
    for (var i = 0; i < idRek.length; i++) {
        id.push(idRek[i]['ID_REKRUTMEN']);
    }

    let res = await db.promise().query(query, [id]);

    return res[0];
}

async function getIDRek(start, end) {
    let rek_available = "SELECT MR.ID_REKRUTMEN, MR.ID_BAGIAN, MB.NAMA_BAGIAN, MR.TGL_MULAI, COUNT(AR.ID_CALON) AS JML FROM MASTER_REKRUTMEN MR " +
        "JOIN MASTER_BAGIAN MB ON MB.ID_BAGIAN = MR.ID_BAGIAN " +
        "JOIN AKTIVITAS_REKRUTMEN AR ON AR.ID_REKRUTMEN = MR.ID_REKRUTMEN " +
        "WHERE MR.TGL_MULAI >= ? AND MR.TGL_SELESAI <= ? AND MR.STAT_REKRUTMEN = ? " +
        "GROUP BY MR.ID_REKRUTMEN";

    let rek_res = await db.promise().query(rek_available, [start, end, 2]);

    // console.log(rek_res[0]);

    // let query = "SELECT * FROM AKTIVITAS_REKRUTMEN AR " +
    //     "JOIN MASTER_CALON_KARYAWAN MCK ON AR.ID_CALON = MCK.ID_CALON " +
    //     "WHERE AR.ID_REKRUTMEN = ?";

    // let res = await db.promise().query(query, idLap);

    return rek_res[0];
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
    getDetailLaporan,
    getdateHistory,
    getIDRek,
    getDetailLaporanRange
}