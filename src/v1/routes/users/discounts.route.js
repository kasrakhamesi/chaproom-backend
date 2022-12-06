const express = require('express')
const router = express.Router()
const fileUpload = require('express-fileupload')
router.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: true,
    createParentPath: true
  })
)
const { nft } = require('../controllers')

router.use('/media', express.static('./app/v1/storages'))
router.post('/generate', nft.public.pinFiles)
router.post('/transfer', nft.public.transfer)
router.post('/history', nft.public.history)

module.exports = router
