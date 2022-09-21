const db = require('../config-app/config-db')
require('express')

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

function findToday() {
    return yyyy + '-' + mm + '-' + dd;
}

function findYear() {
    return yyyy;
}

async function daftarBaru(data) {

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
        data.emailCalon,
        data.passwordCalon
    ]

    let query = "INSERT INTO MASTER_CALON_KARYAWAN " +
        "(NAMA_CALON, FILE_NIK, JENIS_KEL, TEM_LAHIR, TGL_LAHIR, JENJANG_PEND, NAMA_SEK, FAKULTAS, JURUSAN_STUDI, IPK, THN_LULUS, STAT_MBR, STAT_KELENGKAPAN, EMAIL, PASSWORD) " +
        "values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)"

    let res = await db.promise().query(query, dataRefactored)

    //console.log(res[0]['insertId']);

    return res[0]['insertId'];
}

module.exports = {
    findToday,
    daftarBaru,
    findYear
}