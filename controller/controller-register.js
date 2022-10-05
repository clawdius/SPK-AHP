const db = require('../config-app/config-db')
require('express')

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
        data.email,
        data.password,
        '+62'+data.noTelp
    ]

    let query = "INSERT INTO MASTER_CALON_KARYAWAN " +
        "(NAMA_CALON, FILE_NIK, JENIS_KEL, TEM_LAHIR, TGL_LAHIR, JENJANG_PEND, NAMA_SEK, FAKULTAS, JURUSAN_STUDI, IPK, THN_LULUS, STAT_MBR, STAT_KELENGKAPAN, EMAIL, PASSWORD, NO_TELP) " +
        "values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?)"

    let res = await db.promise().query(query, dataRefactored)

    return res[0]['insertId'];
}

async function checkNIK(NIK) {
    let query = "SELECT FILE_NIK FROM MASTER_CALON_KARYAWAN WHERE FILE_NIK = ?"

    let res = await db.promise().query(query, NIK)

    return res[0][0] ? res[0][0] : { FILE_NIK: null };
}

async function checkNIKedit(value) {

    if (value.nik == value.nikSekarang) {
        return { FILE_NIK: null };
    } else {
        let query = "SELECT FILE_NIK FROM MASTER_CALON_KARYAWAN WHERE FILE_NIK = ?"
        let res = await db.promise().query(query, value.nik);
        return res[0][0];
    }
}

async function checkEmail(email) {
    let query = "SELECT EMAIL FROM MASTER_CALON_KARYAWAN WHERE EMAIL = ?"

    let res = await db.promise().query(query, email)

    return res[0][0] ? res[0][0] : { EMAIL: null };
}

module.exports = {
    daftarBaru,
    checkNIK,
    checkEmail,
    checkNIKedit
}