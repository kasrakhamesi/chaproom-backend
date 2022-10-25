const { Router } = require('express')
const router = Router()
const { passport } = require('../../middlewares')

const adminsPassport = passport.adminsPassport.authenticate('jwt', {
  session: false,
  failureRedirect: '/v1/failures/unauthorized'
})

router.use(passport.adminsPassport.initialize())

router.use('/auth', require('./auth.route'))
router.use('/users', adminsPassport, require('./users.route'))
router.use('/addresses', adminsPassport, require('./addresses.route'))
router.use('/cooperations', adminsPassport, require('./cooperations.route'))
router.use('/withdrawals', adminsPassport, require('./withdrawals.route'))

module.exports = router
