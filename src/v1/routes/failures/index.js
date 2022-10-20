const { Router } = require('express')
const router = Router()

router.use('/unauthorized', require('./unauthorized.route'))

module.exports = router
