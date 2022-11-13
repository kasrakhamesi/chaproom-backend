const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { public } = require('../../controllers')

router.get('/category-id/:categoryId', public.blogs.findAllByCategory)

router.put('/slug/:slug/view', public.blogs.increaseViews)
router.get('/slug/:slug', public.blogs.findOne)
router.get('/categories', public.blogs.findAllCategories)
router.get('/', public.blogs.findAll)

module.exports = router
