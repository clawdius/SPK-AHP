const db = require('../config-app/config-db')

async function getActiveRekrutmen(idKar) {
    let qPeriode = "SELECT ID_REKRUTMEN " +
        "FROM MASTER_REKRUTMEN " +
        "WHERE ID_BAGIAN IN" +
        "(SELECT ID_BAGIAN FROM MASTER_KARYAWAN " +
        "WHERE ID_KARYAWAN = ?) " +
        "AND STAT_REKRUTMEN = 0"

    let periode = await db.promise().query(qPeriode, idKar);

    return periode[0][0].ID_REKRUTMEN;
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

async function tambahKriteria(data){
    let query = "INSERT INTO MASTER_KRITERIA(NAMA_KRITERIA, KETERANGAN_KRITERIA) "+
    " VALUES (?,?)";

    let res = await db.promise().query(query, [data.namaKriteria, data.keteranganKriteria]);

    return res[0];
}


module.exports = {
    getMasterKriteria,
    getBagianKriteria,
    addKriteriaBagian,
    getActiveRekrutmen,
    deleteKriteriaBagian,
    tambahKriteria
}