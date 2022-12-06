const { Router, static } = require('express')
const router = Router()
const { passport } = require('../../middlewares')

const usersPassport = passport.usersPassport.authenticate('jwt', {
  session: false,
  failureRedirect: '/v1/failures/unauthorized'
})

router.use(
  '/prints',
  static(__dirname.replace('users', 'files').replace('routes', 'storages'))
)

router.use(passport.usersPassport.initialize())
router.use('/auth', require('./auth.route'))
router.use('/addresses', usersPassport, require('./addresses.route'))
router.use('/wallets', usersPassport, require('./wallets.route'))
router.use('/files', usersPassport, require('./files.route'))
router.use('/folders', usersPassport, require('./folders.route'))
router.use('/profile', usersPassport, require('./profile.route'))
router.use('/transactions', usersPassport, require('./transactions.route'))
router.use('/orders', usersPassport, require('./orders.route'))
router.use('/marketing', usersPassport, require('./marketing.route'))
router.use('/dashboard', usersPassport, require('./dashboard.route'))
router.use('/payments', require('./payments.route'))

module.exports = router
