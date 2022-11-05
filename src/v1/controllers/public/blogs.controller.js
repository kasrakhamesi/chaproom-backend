const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError, errorTypes, messageTypes } = require('../../configs')
const blogs = new restful(sequelize.models.blogs)

const findAllCategories = async (req, res) => {
  try {
    const categories = await sequelize.models.categories.findAll({
      attributes: ['id', 'name']
    })

    const blogAndCategories = []

    for (const entity of categories) {
      const countOfBlogs = await sequelize.models.blogs.count({
        where: { categoryId: entity?.id }
      })

      blogAndCategories.push({
        id: entity?.id,
        name: entity?.name,
        countOfBlogs
      })
    }

    res.status(200).send({
      statusCode: 200,
      data: blogAndCategories,
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const findOne = async (req, res) => {
  try {
    const { slug } = req.params

    const nextAndPreviousBlog = await sequelize.models.blogs.findAll({
      limit: 2,
      include: {
        model: sequelize.models.categories,
        attributes: ['id', 'name']
      },
      attributes: {
        exclude: ['adminId', 'categoryId']
      }
    })

    const r = await sequelize.models.blogs.findOne({
      include: {
        model: sequelize.models.categories,
        attributes: ['id', 'name']
      },
      attributes: {
        exclude: ['adminId', 'categoryId']
      },
      where: {
        slug
      }
    })

    res.status(200).send({
      statusCode: 200,
      data: {
        currentBlog: r,
        nextBlog: nextAndPreviousBlog[0] || r,
        previousBlog: nextAndPreviousBlog[1] || nextAndPreviousBlog[0] || r
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.blogs
    )

    const r = await blogs.Get({
      include: {
        model: sequelize.models.categories,
        attributes: ['id', 'name']
      },
      attributes: {
        exclude: ['adminId', 'categoryId']
      },
      where,
      order,
      pagination: {
        active: true,
        page,
        pageSize
      }
    })

    res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

const increaseViews = async (req, res) => {
  try {
    const { slug } = req.params
    const blog = await sequelize.models.blogs.findOne({
      where: {
        slug
      }
    })

    if (!blog) return httpError(errorTypes.BLOG_NOT_FOUND, res)

    await blog.update({
      countOfViews: parseInt(blog?.countOfViews) + 1
    })

    res
      .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
      .send(messageTypes.SUCCESSFUL_UPDATE)
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = { findAllCategories, increaseViews, findOne, findAll }
