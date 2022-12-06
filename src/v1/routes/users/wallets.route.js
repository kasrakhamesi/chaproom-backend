const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { users } = require('../../controllers')

router.post('/withdrawal', users.wallets.withdrawal)
router.post('/deposit', users.wallets.deposit)

module.exports = router
