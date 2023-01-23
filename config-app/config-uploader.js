const multer = require('multer');

//SetFileName
const store = multer.diskStorage({
    filename: function(req, file, cb) {
        if (file.fieldname == 'foto_ktp') {
            cb(null, 'KTP-' + req.body.NIK + '.jpg')
        } else if (file.fieldname == 'foto_ijazah') {
            cb(null, 'IJ-' + req.body.NIK + '.jpg')
        } else if (file.fieldname == 'cv') {
            cb(null, 'CV-' + req.body.NIK + '.jpg')
        }
    },
    destination: function(req, file, cb) {
        cb(null, './assets/asset-app')
    }
})

const uploader = multer({ storage: store });

module.exports = uploader