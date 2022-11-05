const Types = {
  SUCCESSFUL_UPDATE: {
    statusCode: 200,
    data: {
      message: 'با موفقعیت آپدیت شد'
    },
    error: null
  },
  SUCCESSFUL_DELETE: {
    statusCode: 200,
    data: {
      message: 'با موفقعیت حذف شد'
    },
    error: null
  },
  SUCCESSFUL_CREATED: {
    statusCode: 201,
    data: {
      message: 'با موفقعیت ایجاد شد'
    },
    error: null
  },
  ORDER_SUCCESSFUL_CREATED: {
    statusCode: 201,
    data: {
      message: 'سفارش شما با موفقعیت تکمیل شد'
    },
    error: null
  }
}

module.exports = Types
