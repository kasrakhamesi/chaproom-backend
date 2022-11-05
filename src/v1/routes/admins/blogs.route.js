const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')

router.delete('/categories/id/:id', admins.categories.hardDelete)
router.get('/categories/id/:id', admins.categories.findOne)
router.put('/categories/id/:id', admins.categories.update)
router.get('/categories', admins.categories.findAll)
router.post('/categories', admins.categories.create)

router.delete('/id/:id', admins.blogs.hardDelete)
router.get('/id/:id', admins.blogs.findOne)
router.put('/id/:id', admins.blogs.update)
router.get('/', admins.blogs.findAll)
router.post('/', admins.blogs.create)

module.exports = router
