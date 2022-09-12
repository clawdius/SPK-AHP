require('express')

function hello() {
    return 4;
}

function halo() {
    return 2 + hello();
}

module.exports = {
    hello,
    halo
}