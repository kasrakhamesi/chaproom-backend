const { Router } = require('express')
const router = Router()

const { users } = require('../../controllers')

router.get('/', users.marketing.findOne)

module.exports = router
