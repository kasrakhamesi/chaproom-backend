const { Router } = require('express')
const router = Router()
const { passport } = require('../../middlewares')

const usersPassport = passport.usersPassport.authenticate('jwt', {
  session: false,
  failureRedirect: '/v1/failures/unauthorized'
})

router.use(passport.usersPassport.initialize())

router.use('/auth', require('./auth.route'))
router.use('/addresses', usersPassport, require('./addresses.route'))
router.use('/withdrawals', usersPassport, require('./withdrawals.route'))

module.exports = router
