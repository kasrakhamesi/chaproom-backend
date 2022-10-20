const { Router } = require('express')
const router = Router()

const { failures } = require('../../controllers')

router.get('/', failures.unauthorized)

module.exports = router
