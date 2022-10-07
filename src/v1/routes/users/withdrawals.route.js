const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { users } = require('../../controllers')

router.get('/id/:id', users.withdrawals.findOne)
router.get('/', users.withdrawals.findAll)
router.post('/', users.withdrawals.create)

module.exports = router
