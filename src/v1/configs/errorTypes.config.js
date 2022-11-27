const Types = {
  INVALID_PASSWORD: {
    statusCode: 400,
    message: 'رمزعبور اشتباه است'
  },
  INVALID_PHONE_PASSWORD: {
    statusCode: 400,
    message: 'رمزعبور یا شماره تماس اشتباه است'
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
      'مبلغ وارد شده اشتباه میباشد\nلطفا مبلغ مورد نظر را بصورت عددی وارد کنید'
  },
  GATEWAY_ERROR: {
    statusCode: 400,
    message: 'درگاه پرداخت مشکل دارد\nلطفا بعدا امتحان کنید'
  },
  PAYMENT_FAILED: {
    statusCode: 400,
    message: 'پرداخت با شکست مواجه شد'
  },
  PAYMENT_DOUBLE_SPENDING: {
    statusCode: 400,
    message: 'این صفحه پرداخت قبلا استفاده شده'
  },
  PAYMENT_VERIFICATION_FAILED: {
    statusCode: 400,
    message: 'پرداخت شما تایید نشد\nمبلغ تا 72 ساعت به حساب شما بازمیگردد'
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
  },
  USER_NOT_FOUND: {
    statusCode: 400,
    message: 'کاربری با این مشخصات وجود ندارد'
  },
  USER_ONLY_CAN_CANCEL_ORDER: {
    statusCode: 400,
    message: 'شما فقط میتوانید سفارش را لغو کنید'
  },
  INVALID_OTP: {
    statusCode: 400,
    message: 'کد یکبار مصرف شما اشتباه است\nلطفا مجددا کد را وارد کنید'
  },
  DISCOUNT_CODE_NOT_FOUND: {
    statusCode: 400,
    message: 'کد تخفیف پیدا نشد'
  },
  DISCOUNT_CODE_INACTIVE: {
    statusCode: 400,
    message: 'کد تخفیف غیرفعال شده است'
  },
  DISCOUNT_CODE_EXPIRED: {
    statusCode: 400,
    message: 'مهلت استفاده از کد تخفیف به تمام شده است'
  },
  DISCOUNT_CODE_USAGE_LIMIT: {
    statusCode: 400,
    message:
      'این کد تخفیف به حداکثر استفاده خود رسیده است و دیگر قابل استفاده نمیباشد'
  },
  SLUG_NOT_FOUND: {
    statusCode: 400,
    message: 'کاربری با این اسلاگ پیدا نشد'
  },
  INVALID_OTP_TYPE: {
    statusCode: 400,
    message: 'کد تایید باید بصورت عدد وارد شود'
  },
  INVALID_PHONE_FORMAT: {
    statusCode: 400,
    message: 'فرمت شماره تلفن اشتباه میباشد'
  },
  USER_EXIST_ERROR: {
    statusCode: 400,
    message: 'این شماره تلفن قبلا در سیستم ثبت شده است'
  },
  STATUS_NOT_ALLOWED: {
    statusCode: 400,
    message: 'وضعیت ثبت شده قابل پزیرش نیست'
  },
  MISSING_FILE: {
    statusCode: 400,
    message: 'فایل یافت نشد'
  },
  RESEND_CODE_DATA_NOT_FOUND: {
    statusCode: 400,
    message:
      'درخواستی برای ارسال کد تایید به این شماره وجود ندارد\nلطفا مجددا لاگین  کنید'
  },
  CANT_PASSWORD_RESET: {
    statusCode: 400,
    message:
      'امکان تغییر رمزعبور وجود ندارد\nلطفا مجددا رمزعبور خود را تغییر دهید'
  },
  MISSING_PASSWORD: {
    statusCode: 400,
    message: 'لطفا رمزعبور خود را وارد کنید'
  },
  FOLDER_NOT_FOUND: {
    statusCode: 400,
    message: 'پوشه پیدا نشد'
  },
  INVALID_INPUTS: {
    statusCode: 400,
    message: 'ورودی نامعتبر است'
  },
  TRANSACTION_NOT_CREATED_BY_ADMIN: {
    statusCode: 400,
    message: 'تراکنش توسط ادمین ساخته نشده است'
  },
  DISCOUNT_CODE_EXIST: {
    statusCode: 400,
    message: 'این کد تخفیف قبلا ساخته شده است'
  },
  CAN_NOT_EDIT_MARKETING_DISCOUNT: {
    statusCode: 400,
    message: 'قابلیت تغییر کد تخفیف مارکتینگ کاربر را ندارید'
  },
  INVALID_ORDER_STATUS: {
    statusCode: 400,
    message: 'وضعیت وارد شده برای تراکنش موجود نمیباشد'
  },
  ADMIN_CANT_DELETE_NORMAL_TRANSACTION: {
    statusCode: 400,
    message: 'امکان پاک کردن تراکنش سیستمی وجود ندارد'
  },
  ADMIN_CANT_UPDATE_NORMAL_TRANSACTION: {
    statusCode: 400,
    message: 'امکان بروزرسانی تراکنش سیستمی وجود ندارد'
  },
  ADMIN_EXIST_ERROR: {
    statusCode: 400,
    message: 'این مشخصات به عنوان مدیر قبلا ساخته شده است'
  },
  ADMIN_NOT_FOUND: {
    statusCode: 400,
    message: 'مدیر با این مشخصایت یافت نشد'
  },
  PENDING_COOPERATION_EXIST: {
    statusCode: 400,
    message: 'شما یک درخواست همکاری ثبت شده دارید'
  },
  CANT_DELETE_FOUNDER: {
    statusCode: 400,
    message: 'امکان حذف حساب مالک سایت وجود ندارد'
  },
  ORDER_NOT_FOUND: {
    statusCode: 400,
    message: 'سفارش با شماره یکتای وارد شده یافت نشد'
  },
  CONTACT_TO_ADMIN: {
    statusCode: 400,
    message: 'مشکلی در سیستم پیش امده است.لطفا به ادمین گزارش دهید'
  },
  CATEGORY_NOT_FOUND: {
    statusCode: 400,
    message: 'دسته بندی انتخاب شده وجود ندارد'
  },
  INVALID_IMAGE_FORMAT: {
    statusCode: 400,
    message:
      'فرمت عکس شما قابل قبول نمیباشد.لطفا عکس را با فرمت های استاندارد وارد کنید'
  },
  BLOG_NOT_FOUND: {
    statusCode: 400,
    message: 'وبلاگ موردنظر یافت نشد'
  },
  YOU_HAVE_PENDING_WITHDRAWAL: {
    statusCode: 400,
    message: 'شما یک درخواست برداشت در انتظار تایید دارید'
  },
  DONT_HAVE_FOLDERS: {
    statusCode: 400,
    message: 'شما هیچ پوشه ای برای ثبت سفارش ندارید'
  },
  CATEGORY_NOT_SELECTED: {
    statusCode: 400,
    message: 'هیچ دسته بندی معتبری برای این وبلاگ انتخاب نشده است'
  },
  TIMEFRAME_NOT_EXIST: {
    statusCode: 400,
    message: 'تایم فریم انتخابی شما وجود ندارد'
  },
  FILTER_NOT_EXIST: {
    statusCode: 400,
    message: 'فیلتر انتخابی شما وجود ندارد'
  }
}

module.exports = Types
