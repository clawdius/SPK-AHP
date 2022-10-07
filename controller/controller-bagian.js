const db = require('../config-app/config-db')

async function getActiveRekrutmen(idKar) {
    let qPeriode = "SELECT ID_REKRUTMEN " +
        "FROM MASTER_REKRUTMEN " +
        "WHERE ID_BAGIAN IN" +
        "(SELECT ID_BAGIAN FROM MASTER_KARYAWAN " +
        "WHERE ID_KARYAWAN = ?) " +
        "AND STAT_REKRUTMEN IN (0, 1)"

    let periode = await db.promise().query(qPeriode, idKar);

    return periode[0][0].ID_REKRUTMEN;
}

async function getStatusRekrutmen(idKar) {
    let qPeriode = "SELECT STAT_REKRUTMEN " +
        "FROM MASTER_REKRUTMEN " +
        "WHERE ID_BAGIAN IN " +
        "(SELECT ID_BAGIAN FROM MASTER_KARYAWAN " +
        "WHERE ID_KARYAWAN = ?) "

    let res = await db.promise().query(qPeriode, idKar);

    return res[0][0].STAT_REKRUTMEN;
}

async function getMasterKriteria(idKar) {
    let query = "SELECT * FROM MASTER_KRITERIA " +
        "WHERE ID_KRITERIA NOT IN " +
        "(SELECT ID_KRITERIA FROM BOBOT_KRITERIA " +
        "WHERE ID_REKRUTMEN = ?) "

    let res = await db.promise().query(query, [await getActiveRekrutmen(idKar)]);

    return res[0];
}

async function getBagianKriteria(idKar) {
    let query = "SELECT * FROM BOBOT_KRITERIA BK " +
        "JOIN MASTER_KRITERIA MK " +
        "ON BK.ID_KRITERIA = MK.ID_KRITERIA " +
        "WHERE BK.ID_REKRUTMEN = ?"

    let res = await db.promise().query(query, [await getActiveRekrutmen(idKar)])

    return res[0];
}

async function addKriteriaBagian(data, idKar) {
    let query = "INSERT INTO BOBOT_KRITERIA(ID_REKRUTMEN, ID_KRITERIA) " +
        "values(?, ?)";

    let res = await db.promise().query(query, [
        await getActiveRekrutmen(idKar), data.idKriteria
    ])

    return res[0];
}

async function deleteKriteriaBagian(idKrit, idKar) {
    let query = "DELETE FROM BOBOT_KRITERIA " +
        "WHERE ID_KRITERIA = ? AND ID_REKRUTMEN = ?"

    let res = await db.promise().query(query, [idKrit, await getActiveRekrutmen(idKar)])

    return res[0];
}

async function tambahKriteria(data) {
    let query = "INSERT INTO MASTER_KRITERIA(NAMA_KRITERIA, KETERANGAN_KRITERIA) " +
        " VALUES (?,?)";

    let res = await db.promise().query(query, [data.namaKriteria, data.keteranganKriteria]);

    return res[0];
}

async function updateBobot(data, idKar) {

    let rekActive = await getActiveRekrutmen(idKar);

    let query = "UPDATE BOBOT_KRITERIA SET BOBOT = ? " +
        "WHERE ID_KRITERIA = ? AND ID_REKRUTMEN = ?"

    for (i = 0; i < data.idKriteria.length; i++) {
        await db.promise().query(query, [data.bobotKriteria[i], data.idKriteria[i], rekActive]);
    };

    let ubahStatusQ = "UPDATE MASTER_REKRUTMEN SET STAT_REKRUTMEN = 1 " +
        "WHERE ID_REKRUTMEN = ?";

    await db.promise().query(ubahStatusQ, rekActive);

    return true;

}

async function getListCalonKar(idBag) {
    let query = "SELECT AR.*, MCK.NAMA_CALON AS NAMA FROM AKTIVITAS_REKRUTMEN AR " +
        "JOIN MASTER_REKRUTMEN MR " +
        "ON AR.ID_REKRUTMEN = MR.ID_REKRUTMEN " +
        "JOIN MASTER_CALON_KARYAWAN MCK " +
        "ON AR.ID_CALON = MCK.ID_CALON " +
        "WHERE MR.ID_BAGIAN = ? " +
        "AND MR.STAT_REKRUTMEN = 1";

    let res = await db.promise().query(query, idBag);

    return res[0];
}

async function finishedSubmit(idBag) {
    let query = "SELECT NCK.NILAI FROM AKTIVITAS_REKRUTMEN AR " +
        "JOIN MASTER_REKRUTMEN MR " +
        "ON AR.ID_REKRUTMEN = MR.ID_REKRUTMEN " +
        "JOIN MASTER_CALON_KARYAWAN MCK " +
        "ON AR.ID_CALON = MCK.ID_CALON " +
        "LEFT JOIN NILAI_CALON_KARYAWAN NCK " +
        "ON AR.ID_AKTIVITAS = NCK.ID_AKTIVITAS " +
        "WHERE MR.ID_BAGIAN = ? " +
        "AND MR.STAT_REKRUTMEN = 1 " +
        "LIMIT 1 ";

    let res = await db.promise().query(query, idBag)

    return res[0][0].NILAI == null ? 'allowed' : 'no';
}

async function getListNilai(idBag) {
    let query = "SELECT AR.*, MCK.NAMA_CALON, NCK.* FROM AKTIVITAS_REKRUTMEN AR " +
        "JOIN MASTER_REKRUTMEN MR " +
        "ON AR.ID_REKRUTMEN = MR.ID_REKRUTMEN " +
        "JOIN MASTER_CALON_KARYAWAN MCK " +
        "ON AR.ID_CALON = MCK.ID_CALON " +
        "LEFT JOIN NILAI_CALON_KARYAWAN NCK " +
        "ON AR.ID_AKTIVITAS = NCK.ID_AKTIVITAS " +
        "WHERE MR.ID_BAGIAN = ? " +
        "AND MR.STAT_REKRUTMEN = 1";

    let res = await db.promise().query(query, idBag);

    return res[0];
}

async function submitNilai(data) {
    let dataRefactored = [];

    for (i = 0; i < data.idkrit.length; i++) {
        dataRefactored.push([data.idAktivitas[i], data.idkrit[i], data.nilaikrit[i]])
    };

    let query = "INSERT INTO NILAI_CALON_KARYAWAN VALUES ?";

    let res = await db.promise().query(query, [dataRefactored]);

    return res;
}

module.exports = {
    getMasterKriteria,
    getBagianKriteria,
    addKriteriaBagian,
    getActiveRekrutmen,
    deleteKriteriaBagian,
    tambahKriteria,
    updateBobot,
    getStatusRekrutmen,
    getListCalonKar,
    submitNilai,
    finishedSubmit,
    getListNilai
}