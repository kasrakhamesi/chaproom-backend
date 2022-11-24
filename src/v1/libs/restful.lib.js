const { httpError, errorTypes, messageTypes } = require('../configs')
const _ = require('lodash')

const paginate = (query, { page, pageSize }) => {
  const offset = page * pageSize
  const limit = pageSize
  return {
    ...(query || null),
    offset,
    limit
  }
}

const paging = (
  tableName,
  sequelizeResult,
  page,
  pageSize,
  pagingActive = true
) => {
  page = pagingActive ? page + 1 : page

  const totalCount = sequelizeResult.count

  let totalCountLeft = 0
  if (_.isEmpty(sequelizeResult.rows) || totalCount - page * pageSize <= 0) {
    totalCountLeft = 0
  } else if (totalCount - page * pageSize > 0) {
    if (page * pageSize <= 0) {
      totalCountLeft = 0
    } else {
      totalCountLeft = totalCount - page * pageSize
    }
  }

  let pageLeft = totalCountLeft / pageSize
  pageLeft = pageLeft < 1 && pageLeft > 0 ? pageLeft + 1 : pageLeft
  totalPageLeft = parseInt(pageLeft)

  return {
    page,
    pageSize,
    totalCount,
    totalPageLeft,
    totalCountLeft,
    [tableName]: sequelizeResult.rows
  }
}

class Restful {
  #model
  constructor(model) {
    this.#model = model
  }

  #generateNewTableName = () => {
    const tableName = this.#model.tableName
    let newTableName = ''
    for (let k = 0; k < tableName.length; k++) {
      if (tableName[k] === '_') {
        k++
        newTableName += String(tableName[k]).toUpperCase()
        continue
      }
      newTableName += tableName[k]
    }
    return newTableName
  }

  /*
     @ Get method for updating or changing data
    */

  Get = async ({
    include: include = null,
    where: where = null,
    order: order = null,
    limit: limit = null,
    attributes: attributes = null,
    findOne: findOne = false,
    pagination: pagination = null
  }) => {
    try {
      let resGet
      if (pagination === null || !pagination?.active)
        resGet = where?.id
          ? await this.#model.findByPk(parseInt(where?.id), {
              where: where,
              attributes: attributes,
              include: include,
              order: order,
              limit: limit
            })
          : findOne
          ? await this.#model.findOne({
              where: where,
              attributes: attributes,
              include: include,
              order: order,
              limit: limit
            })
          : await this.#model.findAll({
              where: where,
              attributes: attributes,
              include: include,
              order: order,
              limit: limit
            })
      else if (!findOne && pagination?.active) {
        if (_.isEmpty(pagination?.pageSize)) pagination.pageSize = 5

        if (_.isEmpty(pagination?.page)) pagination.page = 1

        if (
          typeof parseInt(pagination?.pageSize) !== 'number' ||
          typeof parseInt(pagination?.page) !== 'number'
        )
          throw new Error("'page' and 'pageSize' must be integer")

        const pageSize = parseInt(pagination?.pageSize)
        const page = parseInt(pagination?.page)

        if (pageSize > 100) throw new Error('PageSize must under 100')

        if (page === 0) {
          resGet = await this.#model.findAndCountAll({
            where: where,
            attributes: attributes,
            include: include,
            order: order
          })

          resGet = paging(
            this.#generateNewTableName(),
            resGet,
            page,
            Number.MAX_VALUE,
            false
          )
        } else {
          resGet = await this.#model.findAndCountAll(
            paginate(
              {
                where: where,
                attributes: attributes,
                include: include,
                order: order
              },
              { page: page - 1, pageSize }
            )
          )
          resGet = paging(
            this.#generateNewTableName(),
            resGet,
            page - 1,
            pageSize
          )
        }
      }

      return {
        statusCode: 200,
        data: _.isEmpty(resGet) ? [] : resGet,
        error: null
      }
    } catch (e) {
      console.log(e)
      return httpError(e)
    }
  }

  /*
     @ Post method for create data
    */

  Post = async ({ body: body }) => {
    try {
      const resCreate = await this.#model.create(body)

      return {
        statusCode: 201,
        data: resCreate,
        error: null
      }
    } catch (e) {
      return httpError(e)
    }
  }

  /*
     @ PUT method for updating or changing data
    */

  Put = async ({ body: body, where: where = null }) => {
    try {
      if (where === undefined || where === null || where === '')
        return errorTypes.INVALID_INPUTS

      await this.#model.update(body, {
        where: where
      })
      return messageTypes.SUCCESSFUL_UPDATE
    } catch (e) {
      return httpError(e)
    }
  }

  /*
     @ Delete method for updating or changing data
    */

  Delete = async ({ where: where = null }) => {
    try {
      if (where === undefined || where === null || where === '')
        return errorTypes.INVALID_INPUTS

      await this.#model.destroy({
        where: where
      })

      return messageTypes.SUCCESSFUL_DELETE
    } catch (e) {
      return httpError(e)
    }
  }
}

module.exports = Restful
