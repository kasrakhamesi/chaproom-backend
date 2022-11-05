const { Router } = require('express')
const router = Router()
const fileUpload = require('express-fileupload')
router.use(
  fileUpload({
    limits: { fileSize: 200 * 1024 * 1024 },
    defCharset: 'utf8',
    defParamCharset: 'utf8',
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: true,
    createParentPath: true
  })
)
const { admins } = require('../../controllers')

//router.use('/media', express.static('./app/v1/storages'))
router.delete('/id/:id', admins.blogsUploader.hardDelete)
router.post('/', admins.blogsUploader.upload)

module.exports = router
