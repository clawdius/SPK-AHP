const db = require('mysql2');

const conn = db.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    database: 'spk_ahp',
    dateStrings: true
})

try {
    conn.connect();
    console.log('Connection Success')
} catch (e) {
    throw e;
}

module.exports = conn;