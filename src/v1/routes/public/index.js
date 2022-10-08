const { Router } = require('express')
const router = Router()

router.use('/contact-us', require('./contactUs.route'))

module.exports = router
