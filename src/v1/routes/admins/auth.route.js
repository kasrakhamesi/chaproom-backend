const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')
router.post('/login', admins.auth.login)
router.post('/login/confirm', admins.auth.loginConfirm)
router.post('/resend-code', admins.auth.resendCode)

router.post('/password-reset', admins.auth.passwordReset)
router.post(
  '/password-reset/confirm-code',
  admins.auth.passwordResetConfirmCode
)
router.put('/password-reset', admins.auth.passwordResetSubmit)

module.exports = router
