const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { users } = require('../../controllers')

router.get('/', users.profile.findOne)
router.get('/dashboard', users.profile.dashboard)
router.put('/change', users.profile.update)

module.exports = router
