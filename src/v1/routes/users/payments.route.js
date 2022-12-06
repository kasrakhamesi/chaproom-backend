const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { users } = require('../../controllers')

router.get('/callback', users.payments.callback)

module.exports = router
