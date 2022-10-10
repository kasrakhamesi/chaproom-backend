const { Router } = require('express')
const router = Router()

router.use('/contact-us', require('./contactUs.route'))
router.use('/affiliates', require('./affiliates.route'))

module.exports = router
