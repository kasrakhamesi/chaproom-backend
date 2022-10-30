const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { public } = require('../../controllers')

router.get('/', public.tariffs.findAll)

module.exports = router
