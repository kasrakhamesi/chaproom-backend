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
  }
}

module.exports = Types
