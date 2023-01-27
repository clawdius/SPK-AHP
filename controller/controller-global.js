const math = require('../node_modules/mathjs/lib/browser/math');
const db = require('../config-app/config-db')

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

function findToday() {
    return yyyy + '-' + mm + '-' + dd;
}

function findMaxAge() {
    return (yyyy - 17) + '-12-31'
}

function findYear() {
    return yyyy;
}

async function hitungRekomendasi(nilai, bobot) {
    let id_kriteria = [];
    let prioritas = [];
    let perbandingan = [];
    let penjumlahan_perbandingan = [];
    let pembagian_perbandingan = [];
    let rata_rata_kriteria = [];
    let user = [];
    let lambda_max = 0;
    let ci = 0;
    let proses = [];

    console.log("------");
    //memasukkan kriteria kedalam array
    for (let i = 0; i < bobot.length; i++) {
        id_kriteria.push(bobot[i].ID_KRITERIA);
        prioritas.push(bobot[i].BOBOT);
    }

    //memasukkan calon_kry yang memiliki nilai
    for (let i = 0; i < nilai.length; i++) {
        user.push(nilai[i].ID_CALON);
    }

    //menghilangkan duplikasi calon_kry
    user = uniq_fast(user);

    // console.log("ID Krit", id_kriteria);
    // console.log("Prioritas", prioritas);

    //pembagian nilai bobot kiri/atas
    for (let i = 0; i < id_kriteria.length; i++) {
        for (let j = 0; j < id_kriteria.length; j++) {
            if (Array.isArray(perbandingan[i])) {
                perbandingan[i].push(+(prioritas[i] / prioritas[j]).toFixed(2));
            } else {
                perbandingan.push([+(prioritas[i] / prioritas[j]).toFixed(2)]);
            }
        }
    }
    // console.log("Perbandingan", perbandingan);

    //Penjumlahan hasil pembobotan per-kolom
    for (let i = 0; i < perbandingan.length; i++) {
        let hasil = 0;
        for (let j = 0; j < perbandingan.length; j++) {
            hasil = +(hasil + perbandingan[j][i]).toFixed(2);
        }
        penjumlahan_perbandingan.push([hasil]);
    }
    // console.log("Penjumlahan Perbandingan", penjumlahan_perbandingan);

    //perhitungan normalisasi
    for (let i = 0; i < perbandingan.length; i++) {
        for (let j = 0; j < perbandingan.length; j++) {
            if (Array.isArray(pembagian_perbandingan[i])) {
                pembagian_perbandingan[i].push(+(perbandingan[i][j] / penjumlahan_perbandingan[j][0]).toFixed(2));
            } else {
                pembagian_perbandingan.push([+(perbandingan[i][j] / penjumlahan_perbandingan[j][0]).toFixed(2)]);
            }
        }
    }
    // console.log("Pembagian perbandingan", pembagian_perbandingan);

    //rata-rata normalisasi
    for (let i = 0; i < pembagian_perbandingan.length; i++) {
        let hasil = 0;
        for (let j = 0; j < pembagian_perbandingan[i].length; j++) {
            hasil = hasil + pembagian_perbandingan[i][j];
        }
        hasil = +(hasil / pembagian_perbandingan[i].length).toFixed(2);
        if (Array.isArray(rata_rata_kriteria[0])) {
            rata_rata_kriteria[0].push(hasil);
        } else {
            rata_rata_kriteria.push([hasil]);
        }
    }
    // console.log("Rata2 Kriteria", rata_rata_kriteria);


    //menyesuaikan format matrix mathjs
    let mA = [];
    for (let i = 0; i < perbandingan.length; i++) {
        for (let j = 0; j < perbandingan[i].length; j++) {
            if (Array.isArray(mA[j])) {
                mA[j].push(perbandingan[i][j]);
            } else {
                mA.push([perbandingan[i][j]]);
            }
        }
    }
    // console.log("Matriks", mA);
    //end menyesuaikan format matrix mathjs

    //perkalian matrix dengan mathjs (A3)
    let mB = rata_rata_kriteria;
    let a3 = math.multiply(mB, mA);
    for (let i = 0; i < a3[0].length; i++) {
        a3[0][i] = +(a3[0][i]).toFixed(2);
    }
    // console.log("A3", a3);
    //end perkalian matrix dengan mathjs

    //pembagian matrix (A4)
    let a4 = [];
    for (let i = 0; i < a3[0].length; i++) {
        if (Array.isArray(a4[0])) {
            a4[0].push(+(a3[0][i] / rata_rata_kriteria[0][i]).toFixed(2));
        } else {
            a4.push([+(a3[0][i] / rata_rata_kriteria[0][i]).toFixed(2)]);
        }
    }
    // console.log("A4", a4);
    //end pembagian matrix (A4)

    //cari lambda max
    for (let i = 0; i < a4[0].length; i++) {
        lambda_max += a4[0][i];
    }
    lambda_max = +(lambda_max / a4[0].length).toFixed(2);
    // console.log('Lbd_Max: ' + lambda_max);
    //end cari lambda max

    //cari CI
    ci = +((lambda_max - id_kriteria.length) / (id_kriteria.length - 1)).toFixed(2);
    // console.log('CI: ' + ci);
    //end cari CI

    //cari RI
    let rc_table = [
        0.00, 0.00,
        0.58, 0.89,
        1.12, 1.26,
        1.36, 1.41,
        1.42, 1.49,
        1.52, 1.54,
        1.56, 1.58
    ];
    let ri = rc_table[(id_kriteria.length) - 1];
    // console.log('RI: ' + ri);
    //end cari RI

    //cari CR
    cr = ci / ri;
    // console.log('CR: ' + ci + '/' + ri + ' = ' + cr);
    //end cari CR

    //perhitungan nilai
    let nilaiTemp = [];
    let jmlnilaiTemp = [];
    let kategoriTemp = [];
    let sebelum_normal = [];
    for (let i = 0; i < nilai.length; i++) {
        nilaiTemp.push([nilai[i].ID_CALON, nilai[i].ID_KRITERIA, +(nilai[i].NILAI)]);
        sebelum_normal.push([nilai[i].ID_CALON, nilai[i].ID_KRITERIA, +(nilai[i].NILAI)]);
        kategoriTemp.push(nilai[i].ID_KRITERIA);
    }
    // console.log("Nilai Temp", nilaiTemp);

    //cari kategori unik
    kategoriTemp = uniq_fast(kategoriTemp);
    //end cari kategori unik

    //cari jumlah nilai per-kategori
    for (let i = 0; i < kategoriTemp.length; i++) {
        let jml = 0;
        for (let j = 0; j < nilai.length; j++) {
            if (nilai[j].ID_KRITERIA == kategoriTemp[i]) {
                jml = jml + (+nilai[j].NILAI);
            }
        }
        jmlnilaiTemp.push([kategoriTemp[i], jml]);
    }
    // console.log("Juml Nilai Temp", jmlnilaiTemp);
    //end cari jumlah nilai per-kategori

    //cari nilai normalisasi
    for (let i = 0; i < jmlnilaiTemp.length; i++) {
        for (let j = 0; j < nilaiTemp.length; j++) {
            if (jmlnilaiTemp[i][0] == nilaiTemp[j][1]) {
                nilaiTemp[j][2] = +(nilaiTemp[j][2] / jmlnilaiTemp[i][1]).toFixed(2);
            }
        }
    }

    // console.log("Nilai Temp Update", nilaiTemp);
    let normalisasi = nilaiTemp;
    //end cari nilai normalisasi

    //end perhitungan nilai
    let a2 = [];
    for (let i = 0; i < id_kriteria.length; i++) {
        a2.push([id_kriteria[i], rata_rata_kriteria[0][i]]);
    }
    // console.log("A2", a2);

    let nilai_kali = [];
    for (let i = 0; i < nilaiTemp.length; i++) {
        for (let j = 0; j < a2.length; j++) {
            if (nilaiTemp[i][1] == a2[j][0]) {
                nilai_kali.push([nilaiTemp[i][0], nilaiTemp[i][1], +(nilaiTemp[i][2] * a2[j][1]).toFixed(2)]);
            }
        }
    }

    // console.log("Nilai Kali", nilai_kali)
    // console.log("User", user)

    let nilai_jumlah = {};

    for (i = 0; i < user.length; i++) {
        let jml = 0;
        for (j = 0; j < nilai_kali.length; j++) {
            if (nilai_kali[j][0] == user[i]) {
                jml += nilai_kali[j][2];
            }
        }
        // nilai_jumlah.push([user[i], jml]);
        // console.log(jml.toFixed(2));
        nilai_jumlah[user[i]] = +(jml.toFixed(2));
    }
    // console.log('Nilai Jumlah', nilai_jumlah);

    let sort = Object.entries(nilai_jumlah).sort((a, b) => b[1] - a[1]);

    let clean = []
    for (i = 0; i < sort.length; i++) {
        clean.push(sort[i][0]);
    }
    // console.log('Sorted', clean);

    let query = "SELECT * FROM MASTER_CALON_KARYAWAN " +
        "WHERE ID_CALON IN (?) " +
        "ORDER BY FIELD (ID_CALON, ?)";

    let res = await db.promise().query(query, [clean, clean])

    //buat tampilan perhitungan
    proses.push({
        'Perbandingan': perbandingan,
        'penjumlahan_Perbandingan': penjumlahan_perbandingan,
        'pembagian_Perbandingan': pembagian_perbandingan,
        'rata2_Kriteria': rata_rata_kriteria,
        'A1': mA,
        'A2': mB,
        'A3': a3,
        'A4': a4,
        'lambda_Max': lambda_max,
        'CI': ci,
        'RI': ri,
        'CR': cr,
        'nilai_Temp': sebelum_normal,
        'juml_nilai_Temp': jmlnilaiTemp,
        'normalisasi_Nilai': normalisasi,
        'nilai_Kali_A2': nilai_kali,
        'nilai_Jumlah': nilai_jumlah
    });
    //end -- buat tampilan perhitungan
    // console.log(proses[0]);

    return [res[0], nilai_jumlah, proses];
}

function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for (var i = 0; i < len; i++) {
        var item = a[i];
        if (seen[item] !== 1) {
            seen[item] = 1;
            out[j++] = item;
        }
    }
    return out;
}

module.exports = {
    findToday,
    findYear,
    findMaxAge,
    hitungRekomendasi
}