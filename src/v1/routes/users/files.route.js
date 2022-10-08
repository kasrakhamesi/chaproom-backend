const { Router } = require('express')
const router = Router()
const fileUpload = require('express-fileupload')
router.use(
  fileUpload({
    limits: { fileSize: 200 * 1024 * 1024 },
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: true,
    createParentPath: true
  })
)
const { users } = require('../../controllers')

//router.use('/media', express.static('./app/v1/storages'))
router.post('/', users.files.upload)

module.exports = router
