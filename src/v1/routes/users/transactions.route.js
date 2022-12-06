const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { users } = require('../../controllers')

router.get('/id/:id', users.transactions.findOne)
router.get('/', users.transactions.findAll)

module.exports = router
