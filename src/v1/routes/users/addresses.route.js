const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { users } = require('../../controllers')

router.delete('/id/:id', users.addresses.softDelete)
router.put('/id/:id', users.addresses.update)
router.get('/id/:id', users.addresses.findOne)
router.get('/', users.addresses.findAll)
router.post('/', users.addresses.create)

module.exports = router
