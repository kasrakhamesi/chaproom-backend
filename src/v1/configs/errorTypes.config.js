const Types = {
  INVALID_PASSWORD: {
    statusCode: 400,
    message: 'رمزعبور اشتباه است'
  },
  INVALID_PHONE_PASSWORD: {
    statusCode: 400,
    message: 'رمزعبور یا شماره تماس اشتباه است'
  },
  INVALID_USERNAME_PASSWORD: {
    statusCode: 400,
    message: 'رمزعبور یا نام کاربری اشتباه است'
  },
  UNAUTHORIZED: {
    statusCode: 401,
    message: 'دسترسی غیر مجاز'
  },
  INVALID_PDF_DOCX_FORMAT: {
    statusCode: 400,
    message: 'فرمت فایل انتخاب شده توسط سیستم پشتیبانی نمیشود'
  },
  FILE_NOT_SELECTED: {
    statusCode: 400,
    message: 'فایلی برای آپلود انتخاب نشده است'
  },
  INVALID_AMOUNT_TYPE: {
    statusCode: 400,
    message:
      'مبلغ وارد شده اشتباه میباشد.لطفا مبلغ مورد نظر را بصورت عددی وارد کنید'
  },
  GATEWAY_ERROR: {
    statusCode: 400,
    message: 'درگاه پرداخت مشکل دارد.لطفا بعدا امتحان کنید'
  },
  PAYMENT_FAILED: {
    statusCode: 400,
    message: 'پرداخت با شکست مواجه شد'
  },
  PAYMENT_FAILED: {
    statusCode: 400,
    message: 'این صفحه پرداخت قبلا استفاده شده'
  },
  PAYMENT_VERIFICATION_FAILED: {
    statusCode: 400,
    message: 'پرداخت شما تایید نشد.مبلغ تا 72 ساعت به حساب شما بازمیگردد'
  },
  INVALID_ADDRESS: {
    statusCode: 400,
    message:
      'آدرس انتخاب نشده است یا آدرس انتخاب شده مربوط به این کاربر نمیباشد'
  },
  MISSING_FOLDERS: {
    statusCode: 400,
    message: 'هیچ پوشه ای انتخاب نشده است'
  },
  MISSING_TRANSACTION: {
    statusCode: 400,
    message: 'تراکنش پیدا نشد'
  },
  INSUFFICIENT_FUNDS: {
    statusCode: 400,
    message: 'موجودی شما کافی نمیباشد'
  }
}

module.exports = Types
