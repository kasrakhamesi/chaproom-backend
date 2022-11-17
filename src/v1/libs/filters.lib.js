const { Op } = require('sequelize')
const _ = require('lodash')

const sort = (query) => {
  try {
    if (!query.sort) return null

    let { sort } = query
    sort = JSON.parse(sort)
    if (sort.length !== 2) throw new Error('Invalid Sort Input')
    sort[1] = String(sort[1]).toUpperCase()
    if (sort[1] !== 'ASC' && sort[1] !== 'DESC')
      throw new Error('Invalid Sort Option')

    return [sort]
  } catch {
    return null
  }
}

const filter = async (query, model) => {
  try {
    let resSearch = null
    if (query.search) {
      const { search } = query
      resSearch = await searchStructre(model, search)
    }
    const resSort = sort(query)

    const structure = []

    for (const key in query) {
      if (
        String(key).toLowerCase() === 'sort' ||
        String(key).toLowerCase() === 'search' ||
        String(key).toLowerCase() === 'page' ||
        String(key).toLowerCase() === 'pagesize' ||
        String(key).toLowerCase() === 'startat' ||
        String(key).toLowerCase() === 'endat' ||
        String(key).toLowerCase() === 'papersize' ||
        String(key).toLowerCase() === 'paperside' ||
        String(key).toLowerCase() === 'papercolor' ||
        String(key).toLowerCase() === 'sortorder'
      )
        continue
      structure.push({ [key]: query[key] })
    }

    let where = []
    structure.forEach((item) => {
      const key = Object.keys(item)
      const queryFormatKey = String(key).includes('.') ? `$${key}$` : key
      item[key] = _.isArray(item[key]) ? item[key] : [item[key]]
      for (let k = 0; k < item[key].length; k++) {
        let OpFilter = Op.eq

        if (String(item[key][k]).startsWith('not:')) {
          item[key][k] = String(item[key][k]).substring(4)
          OpFilter = Op.not
        } else if (String(item[key][k]).startsWith('equal:')) {
          item[key][k] = String(item[key][k]).substring(6)
          Op.filter = Op.eq
        } else if (String(item[key][k]).startsWith('like:')) {
          item[key][k] = `%${String(item[key][k]).substring(5)}%`
          Op.like
        } else if (String(item[key][k]).startsWith('greater:')) {
          item[key][k] = String(item[key][k]).substring(8)
          Op.gt
        } else if (String(item[key][k]).startsWith('less:')) {
          item[key][k] = String(item[key][k]).substring(5)
          Op.lt
        } else if (String(item[key][k]).startsWith('notlike:')) {
          item[key][k] = `%${String(item[key][k]).substring(8)}%`
          Op.notLike
        }

        where.push({
          [queryFormatKey]: {
            [OpFilter]: item[key][k]
          }
        })
      }
    })
    where = await Promise.all(where)
    where =
      _.isEmpty(where) && _.isEmpty(resSearch)
        ? null
        : _.isEmpty(where)
        ? {
            [Op.or]: resSearch
          }
        : _.isEmpty(resSearch)
        ? { [Op.and]: where }
        : { [Op.and]: { [Op.and]: where, [Op.or]: resSearch } }

    return [resSort, where]
  } catch {
    return [null, null]
  }
}

const searchStructre = async (model, value) => {
  try {
    const find = await model.findOne({
      attributes: {
        exclude: ['password']
      },
      order: [['createdAt', 'DESC']]
    })

    const condition = []
    for (let k in find.dataValues) {
      if (typeof find[k] === 'string')
        condition.push({
          [k]: {
            [Op.like]: `%${value}%`
          }
        })
    }

    const relationConditions = []
    if (
      model.tableName === 'withdrawals' ||
      model.tableName === 'transactions' ||
      model.tableName === 'orders'
    ) {
      relationConditions.push(
        {
          '$user.name$': {
            [Op.like]: `%${value}%`
          }
        },
        {
          '$user.phoneNumber$': {
            [Op.like]: `%${value}%`
          }
        }
      )
    }
    return [...condition, ...relationConditions]
  } catch {
    return null
  }
}

module.exports = {
  filter
}
