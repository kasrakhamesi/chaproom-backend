const { Router } = require('express')
const router = Router()

router.use('/users', require('./users'))
//router.use('/admins', require('./admins'))

module.exports = router
