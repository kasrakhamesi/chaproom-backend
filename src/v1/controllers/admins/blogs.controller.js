const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError, errorTypes, messageTypes } = require('../../configs')
const { Op } = require('sequelize')
const blogs = new restful(sequelize.models.blogs)

const create = async (req, res) => {
  try {
    const adminId = req?.user[0]?.id

    const {
      categoryId,
      title,
      pageTitle,
      slug,
      description,
      body,
      imageUrl,
      imageAlt,
      display,
      metaDescription,
      keyWords
    } = req.body

    const data = {
      adminId,
      categoryId,
      title,
      pageTitle,
      slug,
      description,
      body,
      imageUrl,
      imageAlt,
      display,
      metaDescription,
      keyWords
    }

    const category = await sequelize.models.categories.findOne({
      where: {
        id: categoryId
      }
    })

    if (!category) return httpError(errorTypes.CATEGORY_NOT_FOUND, res)

    await sequelize.models.blogs.create(data)

    res
      .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
      .send(messageTypes.SUCCESSFUL_CREATED)
  } catch (e) {
    return httpError(e, res)
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params

    const adminId = req?.user[0]?.id

    const {
      categoryId,
      title,
      pageTitle,
      slug,
      description,
      body,
      imageUrl,
      imageAlt,
      display,
      metaDescription,
      keyWords
    } = req.body

    const data = {
      adminId,
      categoryId,
      title,
      pageTitle,
      slug,
      description,
      body,
      imageUrl,
      imageAlt,
      display,
      metaDescription,
      keyWords
    }
    const category = await sequelize.models.categories.findOne({
      where: {
        id: categoryId
      }
    })

    if (!category) return httpError(errorTypes.CATEGORY_NOT_FOUND, res)

    const r = await blogs.Put({ body: data, where: { id } })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

const findOne = async (req, res) => {
  try {
    const { id } = req.params

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
        id
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

const hardDelete = async (req, res) => {
  try {
    const { id } = req.params
    const r = await blogs.Delete({ where: { id } })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = { create, update, findOne, findAll, hardDelete }
