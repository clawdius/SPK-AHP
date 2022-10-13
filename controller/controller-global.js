const math = require('../node_modules/mathjs/lib/browser/math');

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

function hitungRekomendasi(nilai, bobot){
    let id_kriteria = [];
    let prioritas = [];
    let perbandingan = [];
    let penjumlahan_perbandingan = [];
    let pembagian_perbandingan = [];
    let rata_rata_kriteria = [];
    let lambda_max = 0;

    for (let i = 0; i < bobot.length; i++){
        id_kriteria.push(bobot[i].ID_KRITERIA);
        prioritas.push(bobot[i].BOBOT);
    }
    console.log(id_kriteria);
    console.log(prioritas);


    for (let i = 0; i < id_kriteria.length; i++){
        for (let j = 0; j < id_kriteria.length; j++) {
            if(Array.isArray(perbandingan[i])){
                perbandingan[i].push(+(prioritas[i] / prioritas[j]).toFixed(2));
            } else {
                perbandingan.push([+(prioritas[i] / prioritas[j]).toFixed(2)]);
            }
        }
    }
    console.log(perbandingan);


    for (let i = 0; i < perbandingan.length; i++){
        let hasil = 0;
        for (let j = 0; j < perbandingan.length; j++){
            hasil = +(hasil + perbandingan[j][i]).toFixed(2);
        }
        penjumlahan_perbandingan.push([hasil]);
    }
    console.log(penjumlahan_perbandingan);


    for (let i = 0; i < perbandingan.length; i++) {
        for (let j = 0; j < perbandingan.length; j++) {
            if(Array.isArray(pembagian_perbandingan[i])){
                pembagian_perbandingan[i].push(+(perbandingan[i][j] / penjumlahan_perbandingan[j][0]).toFixed(2));
            } else {
                pembagian_perbandingan.push([+(perbandingan[i][j] / penjumlahan_perbandingan[j][0]).toFixed(2)]);
            }
        }
    }
    console.log(pembagian_perbandingan);


    for (let i = 0; i < pembagian_perbandingan.length; i++) {
        let hasil = 0;
        for (let j = 0; j < pembagian_perbandingan[i].length; j++) {
            hasil = hasil + pembagian_perbandingan[i][j];
        }
        hasil = +(hasil / pembagian_perbandingan[i].length).toFixed(2);
        if(Array.isArray(rata_rata_kriteria[0])){
            rata_rata_kriteria[0].push(hasil);
        } else {
            rata_rata_kriteria.push([hasil]);
        }
    }
    console.log(rata_rata_kriteria);

    //menyesuaikan format matrix mathjs
    let mA = [];
    for (let i = 0; i < perbandingan.length; i++){
        for (let j = 0; j < perbandingan[i].length; j++){
            if(Array.isArray(mA[j])){
                mA[j].push(perbandingan[i][j]);
            } else {
                mA.push([perbandingan[i][j]]);
            }
        }
    }
    //end menyesuaikan format matrix mathjs

    //perkalian matrix dengan mathjs (A3)
    let mB = rata_rata_kriteria;
    let a3 = math.multiply(mB, mA);
    for (let i = 0; i < a3[0].length; i++) {
        a3[0][i] = +(a3[0][i]).toFixed(2);
    }
    console.log(a3);
    //end perkalian matrix dengan mathjs

    //pembagian matrix (A4)
    let a4 = [];
    for (let i = 0; i < a3[0].length; i++) {
        if(Array.isArray(a4[0])){
            a4[0].push(+(a3[0][i]/rata_rata_kriteria[0][i]).toFixed(2));
        } else {
            a4.push([+(a3[0][i]/rata_rata_kriteria[0][i]).toFixed(2)]);
        }
    }
    console.log(a4);
    //end pembagian matrix (A4)

    //cari lambda max
    lambda_max = 0;
    for (let i = 0; i < a4[0].length; i++) {
        lambda_max += a4[0][i];
    }
    lambda_max = +(lambda_max / a4[0].length).toFixed(2);
    console.log(lambda_max);
    //end cari lambda max

    return true;
}

module.exports = {
    findToday,
    findYear,
    hitungRekomendasi
}