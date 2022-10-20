const { Router } = require('express')
const router = Router()

router.use('/users', require('./users'))
router.use('/public', require('./public'))
router.use('/failures', require('./failures'))
//router.use('/admins', require('./admins'))

module.exports = router
