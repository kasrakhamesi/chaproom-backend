const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')

router.post('/id/:id/set-admin', admins.admins.createAdminFromUser)
router.get('/id/:id/marketing', admins.users.marketing)
router.post('/id/:id/jwt', admins.users.generateAccessToken)
router.delete('/id/:id', admins.users.softDelete)
router.put('/id/:id', admins.users.update)
router.get('/id/:id', admins.users.findOne)
router.get('/', admins.users.findAll)
router.post('/', admins.users.create)

module.exports = router
