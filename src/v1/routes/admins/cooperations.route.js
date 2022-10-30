const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')

router.put('/id/:id', admins.cooperations.update)
router.get('/', admins.cooperations.findAll)

module.exports = router
