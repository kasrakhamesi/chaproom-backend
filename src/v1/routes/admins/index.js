const { Router } = require('express')
const router = Router()
const { passport } = require('../../middlewares')

const adminsPassport = passport.adminsPassport.authenticate('jwt', {
  session: false,
  failureRedirect: '/v1/failures/unauthorized'
})

const { admins } = require('../../controllers')

router.use(passport.adminsPassport.initialize())

router.use('/auth', require('./auth.route'))
router.use('/users', adminsPassport, require('./users.route'))
router.use('/addresses', adminsPassport, require('./addresses.route'))
router.use('/cooperations', adminsPassport, require('./cooperations.route'))
router.use('/withdrawals', adminsPassport, require('./withdrawals.route'))
router.use('/transactions', adminsPassport, require('./transactions.route'))
router.use('/discounts', adminsPassport, require('./discounts.route'))
router.use('/tariffs', adminsPassport, require('./tariffs.route'))
router.use('/marketings', adminsPassport, require('./marketings.route'))
router.use('/orders', adminsPassport, require('./orders.route'))
router.use('/profile', adminsPassport, require('./profile.route'))
router.use('/blogs-uploader', adminsPassport, require('./blogsUploader.route'))
router.use('/blogs', adminsPassport, require('./blogs.route'))

router.use(
  '/customers-report',
  adminsPassport,
  require('./customersReport.route')
)

const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.put('/id/:id', adminsPassport, admins.admins.update)
router.get('/id/:id', adminsPassport, admins.admins.findOne)
router.delete('/id/:id', adminsPassport, admins.admins.softDelete)
router.get('/', adminsPassport, admins.admins.findAll)
router.post('/', adminsPassport, admins.admins.create)

module.exports = router
