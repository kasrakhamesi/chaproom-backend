const _ = require("lodash");
const { activities } = require("../services/logger");
const errorsConfig = require("../errors");

const paginate = (query, { page, pageSize }) => {
  const offset = page * pageSize;
  const limit = pageSize;
  return {
    ...(query || null),
    offset,
    limit,
  };
};

const paging = (sequelizeResult, page, pageSize) => ({
  page: page,
  pageSize: pageSize,
  totalCount: sequelizeResult.count,
  totalCountLeft: _.isEmpty(sequelizeResult.rows)
    ? 0
    : sequelizeResult.count - page <= 0
    ? 1
    : page * pageSize < 0
    ? 0
    : sequelizeResult.count - page <= 0
    ? 1
    : page * pageSize,
  data: sequelizeResult.rows,
});

class Restful {
  #model;
  constructor(model) {
    this.#model = model;
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
    pagination: pagination = null,
  }) => {
    try {
      let resGet;
      if (pagination === null)
        resGet = where?.id
          ? await this.#model.findByPk(parseInt(where?.id), {
              where: where,
              attributes: attributes,
              include: include,
              order: order,
              limit: limit,
            })
          : findOne
          ? await this.#model.findOne({
              where: where,
              attributes: attributes,
              include: include,
              order: order,
              limit: limit,
            })
          : await this.#model.findAll({
              where: where,
              attributes: attributes,
              include: include,
              order: order,
              limit: limit,
            });
      else if (!findOne && pagination.active) {
        /*
          pagination?.pageSize === undefined ||
          pagination?.pageSize === null ||
          pagination?.pageSize === '' ||
          pagination?.page === undefined ||
          pagination?.page === null ||
          pagination?.page === ''
       */

        if (_.isEmpty(pagination?.pageSize) || _.isEmpty(pagination?.page)) {
          pagination.page = 0;
          pagination.pageSize = 25;
        }

        if (
          typeof parseInt(pagination?.pageSize) !== "number" ||
          typeof parseInt(pagination?.page) !== "number"
        )
          throw new Error("'page' and 'pageSize' must be integer");

        const pageSize = parseInt(pagination?.pageSize);

        if (pageSize > 100) throw new Error("PageSize must under 100");

        const page = parseInt(pagination?.page);
        resGet = await this.#model.findAndCountAll(
          paginate(
            {
              where: where,
              attributes: attributes,
              include: include,
              order: order,
            },
            { page, pageSize }
          )
        );
        resGet = paging(resGet, page, pageSize);
      }

      return {
        statusCode: _.isEmpty(resGet) ? 404 : 200,
        data: _.isEmpty(resGet) ? null : resGet,
        error: _.isEmpty(resGet)
          ? {
              code: errorsConfig.codes.errorsCode.data_not_found_404.error.code,
              message:
                errorsConfig.codes.errorsCode.data_not_found_404.error.message,
            }
          : null,
      };
    } catch (e) {
      const errorMessage = e?.errors?.message || e.message;
      return errorsConfig.configs.findErrorCode(errorMessage);
    }
  };

  /*
     @ Post method for create data
    */

  Post = async ({
    body: body,
    req: req,
    haveLog: haveLog = false,
    logDescription: logDescription,
  }) => {
    try {
      const resCreate = await this.#model.create(body);
      if (haveLog)
        activities
          .Log(req?.user[0]?.id, logDescription)
          .then(console.log)
          .catch(console.log);

      return {
        statusCode: 201,
        data: resCreate,
        error: null,
      };
    } catch (e) {
      const errorMessage = e?.errors?.message || e.message;
      return errorsConfig.configs.findErrorCode(errorMessage);
    }
  };

  /*
     @ PUT method for updating or changing data
    */

  Put = async ({
    body: body,
    req: req,
    where: where = null,
    haveLog: haveLog = false,
    logDescription: logDescription,
  }) => {
    try {
      if (where === undefined || where === null || where === "")
        throw new Error("Invalid Inputs");

      const resUpdate = await this.#model.update(body, {
        where: where,
      });

      if (resUpdate[0] || resUpdate >= 1) {
        if (haveLog)
          activities
            .Log(req?.user[0]?.id, logDescription)
            .then(console.log)
            .catch(console.log);

        return {
          statusCode: 200,
          data: {
            status: "success",
            message: "your data successfully updated",
          },
          error: null,
        };
      }
      return errorsConfig.codes.errorsCode.data_not_found_404;
    } catch (e) {
      const errorMessage = e?.errors?.message || e.message;
      return errorsConfig.configs.findErrorCode(errorMessage);
    }
  };

  /*
     @ Delete method for updating or changing data
    */

  Delete = async ({
    req: req,
    where: where = null,
    haveLog: haveLog = false,
    logDescription: logDescription,
  }) => {
    try {
      if (where === undefined || where === null || where === "")
        throw new Error("Invalid Inputs");

      const resDelete = await this.#model.destroy({
        where: where,
      });

      if (resDelete[0] || resDelete >= 1) {
        if (haveLog)
          activities
            .Log(req?.user[0]?.id, logDescription)
            .then(console.log)
            .catch(console.log);

        return {
          statusCode: 200,
          data: {
            status: "success",
            message: "your data successfully deleted",
          },
          error: null,
        };
      }

      return errorsConfig.codes.errorsCode.data_not_found_404;
    } catch (e) {
      const errorMessage = e?.errors?.message || e.message;
      return errorsConfig.configs.findErrorCode(errorMessage);
    }
  };
}

module.exports = Restful;
