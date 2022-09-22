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

module.exports = {
    findToday,
    findYear
}