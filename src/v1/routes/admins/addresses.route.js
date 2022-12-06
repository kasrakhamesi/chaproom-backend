const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')

router.get('/user-id/:userId', admins.addresses.findAll)
router.put('/id/:id', admins.addresses.update)
router.delete('/id/:id', admins.addresses.softDelete)
router.get('/id/:id', admins.addresses.findOne)

module.exports = router
