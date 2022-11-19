const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError, messageTypes } = require('../../configs')
const categories = new restful(sequelize.models.categories)

const create = (req, res) => {
  const { name } = req.body
  const data = {
    name
  }
  return sequelize.models.categories
    .create(data)
    .then(() => {
      return res
        .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
        .send(messageTypes.SUCCESSFUL_CREATED)
    })
    .catch((e) => {
      console.log(e)
      return httpError(e, res)
    })
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const data = { name }
    const r = await categories.Put({ body: data, where: { id } })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

const findOne = async (req, res) => {
  try {
    const { id } = req.params
    const category = await sequelize.models.categories.findOne({
      where: {
        id
      }
    })

    const countOfBlogs = await sequelize.models.blogs.count({
      where: { categoryId: category?.id }
    })

    res.status(200).send({
      statusCode: 200,
      data: {
        id: category?.id,
        name: category?.name,
        countOfBlogs
      }
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
      sequelize.models.categories
    )

    const r = await categories.Get({
      where,
      order,
      pagination: {
        active: true,
        page,
        pageSize
      }
    })
    if (r?.statusCode !== 200) return res.status(r?.statusCode).send(r)

    const blogAndCategories = []

    for (const entity of r?.data?.categories) {
      const countOfBlogs = await sequelize.models.blog_categories.count({
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
      data: {
        page: r?.data?.page,
        pageSize: r?.data?.pageSize,
        totalCount: r?.data?.totalCount,
        totalPageLeft: r?.data?.totalPageLeft,
        totalCountLeft: r?.data?.totalCountLeft,
        categories: blogAndCategories
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const hardDelete = async (req, res) => {
  try {
    const { id } = req.params
    const r = await categories.Delete({ where: { id } })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = { create, update, findOne, findAll, hardDelete }
