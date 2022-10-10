const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { public } = require('../../controllers')

router.post('/', public.affiliates.create)

module.exports = router
