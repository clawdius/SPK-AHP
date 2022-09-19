const multer = require('multer');

//SetFileName
const store = multer.diskStorage({
    filename: function(req, file, cb) {
        cb(null, 'KTP-' + req.body.NIK + '.jpg')
    },
    destination: function(req, file, cb) {
        cb(null, './assets/asset-app')
    }
})

const uploader = multer({ storage: store });

module.exports = uploader