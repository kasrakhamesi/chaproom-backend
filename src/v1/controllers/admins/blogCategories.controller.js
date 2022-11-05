const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError, errorTypes, messageTypes } = require('../../configs')
const blogCategories = new restful(sequelize.models.blog_categories)

const create = (req, res) => {}

const update = (req, res) => {}

const findOne = (req, res) => {}

const findAll = (req, res) => {}

const hardDelete = (req, res) => {}

module.exports = { create, update, findOne, findAll, hardDelete }
