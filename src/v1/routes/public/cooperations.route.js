const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { public } = require('../../controllers')

router.post('/', public.cooperations.create)
router.post('/book-publishing', public.cooperations.createBookCounselingRequest)

module.exports = router
