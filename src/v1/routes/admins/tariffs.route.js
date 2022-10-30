const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')

router.get('/binding', admins.bindingTariffs.findAll)
router.put('/binding', admins.bindingTariffs.update)

module.exports = router
