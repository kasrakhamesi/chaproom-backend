const { Router, static } = require('express')
const router = Router()
const fileUpload = require('express-fileupload')
router.use(
  fileUpload({
    defCharset: 'utf8',
    defParamCharset: 'utf8',
    limits: { fileSize: 200 * 1024 * 1024 },
    abortOnLimit: true,
    preserveExtension: true,
    createParentPath: true
  })
)
const { users } = require('../../controllers')

router.delete('/id/:id', users.files.hardDelete)
router.post('/', users.files.upload)

module.exports = router
