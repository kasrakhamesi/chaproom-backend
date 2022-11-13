const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError, errorTypes, messageTypes } = require('../../configs')
const { Op } = require('sequelize')
const blogs = new restful(sequelize.models.blogs)
const blogCategories = new restful(sequelize.models.blog_categories)

const create = async (req, res) => {
  try {
    const adminId = req?.user[0]?.id

    const {
      categories,
      title,
      pageTitle,
      slug,
      description,
      body,
      thumbnailUrl,
      thumbnailAlt,
      display,
      metaDescription,
      keywords
    } = req.body

    const data = {
      adminId,
      categories,
      title,
      pageTitle,
      slug,
      description,
      body,
      thumbnailUrl,
      thumbnailAlt,
      display,
      metaDescription,
      keywords
    }

    if (categories.length === 0)
      return httpError(errorTypes.CATEGORY_NOT_SELECTED, res)

    const allCategories = await sequelize.models.categories.findAll()

    const ids = []
    for (const category of categories) {
      const findedCategory = allCategories.find(
        (item) => item.id === category.id
      )
      if (findedCategory) {
        ids.push(category?.id)
      }
    }

    if (ids.length === 0)
      return httpError(errorTypes.CATEGORY_NOT_SELECTED, res)

    const t = await sequelize.transaction()

    const r = await sequelize.models.blogs.create(data, { transaction: t })

    for (const entity of ids) {
      await sequelize.models.blog_categories.create(
        {
          categoryId: entity,
          blogId: r?.id
        },
        { transaction: t }
      )
    }

    await t.commit()

    res
      .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
      .send(messageTypes.SUCCESSFUL_CREATED)
  } catch (e) {
    return httpError(e, res)
  }
}

const update = async (req, res) => {
  const { id } = req.params

  const adminId = req?.user[0]?.id

  const {
    categories,
    title,
    pageTitle,
    slug,
    description,
    body,
    thumbnailUrl,
    thumbnailAlt,
    display,
    metaDescription,
    keywords
  } = req.body

  const data = {
    adminId,
    categories,
    title,
    pageTitle,
    slug,
    description,
    body,
    thumbnailUrl,
    thumbnailAlt,
    display,
    metaDescription,
    keywords
  }

  if (categories.length === 0)
    return httpError(errorTypes.CATEGORY_NOT_SELECTED, res)

  return sequelize.models.blogs
    .findOne(
      {
        where: {
          id
        }
      },
      {
        include: [
          {
            model: sequelize.models.categories
          }
        ]
      }
    )
    .then((r) => {
      if (!r) return httpError(errorTypes.BLOG_NOT_FOUND, res)

      return sequelize.models.categories
        .findAll()
        .then((allCategories) => {
          const ids = []
          for (const category of categories) {
            const findedCategory = allCategories.find(
              (item) => item.id === category.id
            )
            if (findedCategory) {
              ids.push(category?.id)
            }
          }

          if (ids.length === 0)
            return httpError(errorTypes.CATEGORY_NOT_SELECTED, res)

          r.setCategories(ids)
          r.set(data)

          return sequelize.transaction((t) => {
            return r
              .save({
                transaction: t
              })
              .then((r) => {
                r.save()
              })
          })
        })
        .then(() => {
          return res
            .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
            .send(messageTypes.SUCCESSFUL_UPDATE)
        })
        .catch((e) => {
          return httpError(e, res)
        })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const findOne = async (req, res) => {
  try {
    const { id } = req.params

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
        exclude: ['adminId']
      },
      where: {
        id
      }
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

    const r = await blogs.Get({
      include: [
        {
          model: sequelize.models.categories,
          through: {
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

const hardDelete = async (req, res) => {
  try {
    const { id } = req.params
    const r = await blogs.Delete({ where: { id } })
    res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = {
  create,
  update,
  findOne,
  findAll,
  hardDelete,
  findAllByCategory
}
