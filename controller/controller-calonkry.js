const db = require('../config-app/config-db')
const fs = require('fs');

async function getDetailCalon(IDCALON) {
    let query = "SELECT * FROM MASTER_CALON_KARYAWAN " +
        "WHERE ID_CALON = ?"

    let res = await db.promise().query(query, IDCALON)

    return res[0][0];
}

async function updateDataCalon(data, IDCALON) {

    if (data.NIK != data.NIKLama) {
        fs.unlinkSync('./assets/asset-app/KTP-' + data.NIKLama + '.jpg');
    };

    let dataRefactored = [
        data.namaCalon,
        data.NIK,
        data.kelaminCalon,
        data.tempatCalon,
        data.tanggalCalon,
        data.pendidikanCalon,
        data.sekolahCalon,
        data.fakultasCalon,
        data.jurusanCalon,
        data.ipkCalon,
        data.lulusCalon,
    ];

    let query = "UPDATE MASTER_CALON_KARYAWAN SET " +
        "NAMA_CALON = ?, " +
        "FILE_NIK = ?, " +
        "JENIS_KEL = ?, " +
        "TEM_LAHIR = ?, " +
        "TGL_LAHIR = ?, " +
        "JENJANG_PEND = ?, " +
        "NAMA_SEK = ?, " +
        "FAKULTAS = ?, " +
        "JURUSAN_STUDI = ?, " +
        "IPK = ?, " +
        "THN_LULUS = ?, " +
        "STAT_KELENGKAPAN = 0 " +
        "WHERE ID_CALON = " + IDCALON

    let res = await db.promise().query(query, dataRefactored)

    return res[0]
}

module.exports = {
    getDetailCalon,
    updateDataCalon
}