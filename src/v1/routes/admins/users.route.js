const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')

router.delete('/id/:id', admins.users.softDelete)
router.put('/id/:id', admins.users.update)
router.get('/id/:id', admins.users.findOne)
router.get('/', admins.users.findAll)
router.post('/', admins.users.create)

module.exports = router
