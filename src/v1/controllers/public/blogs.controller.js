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

    const r = await sequelize.models.blogs.findOne({
      include: {
        model: sequelize.models.categories,
        through: {
          attributes: {
            exclude: ['blogId', 'createdAt', 'updatedAt', 'categoryId']
          }
        }
      },
      attributes: {
        exclude: ['display', 'adminId']
      },
      where: {
        slug,
        display: true
      }
    })

    if (!r) return httpError(errorTypes.BLOG_NOT_FOUND, res)

    await r.update({
      countOfViews: parseInt(r?.countOfViews) + 1
    })

    res.status(200).send({
      statusCode: 200,
      data: r,
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

    const newWhere = { ...where, display: true }

    const r = await blogs.Get({
      include: {
        model: sequelize.models.categories,
        through: {
          attributes: {
            exclude: ['blogId', 'createdAt', 'updatedAt', 'categoryId']
          }
        }
      },
      attributes: {
        exclude: ['adminId', 'display', 'body', 'keywords']
      },
      where: newWhere,
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

const findAllByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params

    const category = await sequelize.models.categories.findOne({
      where: {
        id: categoryId
      }
    })

    if (!category) return httpError(errorTypes.CATEGORY_NOT_FOUND, res)

    const { page, pageSize } = req.query

    const findedBlogCategories = await blogCategories.Get({
      where: {
        categoryId
      },
      order: [['id', 'desc']],
      pagination: {
        active: true,
        page,
        pageSize
      }
    })

    if (findedBlogCategories?.statusCode !== 200)
      return res
        .status(findAllByCategory?.statusCode)
        .send(findedBlogCategories)

    let condition = []
    for (const entity of findedBlogCategories?.data?.blogCategories) {
      condition.push({
        id: entity?.blogId
      })
    }

    const r = await sequelize.models.blogs.findAll({
      include: [
        {
          model: sequelize.models.categories,
          through: {
            where: { categoryId },
            attributes: {
              exclude: ['blogId', 'createdAt', 'updatedAt', 'categoryId']
            }
          }
        },
        {
          model: sequelize.models.admins,
          attributes: ['name']
        }
      ],
      attributes: {
        exclude: ['adminId', 'body', 'keywords']
      },
      where: { [Op.or]: condition }
    })

    res.status(200).send({
      statusCode: 200,
      data: {
        page: findedBlogCategories?.data?.page,
        pageSize: findedBlogCategories?.data?.pageSize,
        totalCount: findedBlogCategories?.data?.totalCount,
        totalPageLeft: findedBlogCategories?.data?.totalPageLeft,
        totalCountLeft: findedBlogCategories?.data?.totalCountLeft,
        blogs: r
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = {
  findAllCategories,
  findOne,
  findAll,
  findAllByCategory
}
