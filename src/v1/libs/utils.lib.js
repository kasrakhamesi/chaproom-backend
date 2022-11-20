const timestampToIso = (timestamp) =>
  new Date(
    String(timestamp).length === 10 ? timestamp * 1e3 : timestamp
  ).toISOString()

const isoToTimestamp = (isoTime) => {
  parseInt(new Date(isoTime).getTime())
}

const camelCase = (entity) => {
  let newEntity = ''
  for (let k = 0; k < entity.length; k++) {
    if (entity[k] === '_') {
      k++
      newEntity += String(entity[k]).toUpperCase()
      continue
    }
    newEntity += entity[k]
  }
  return newEntity
}

class PersianDate extends Date {
  constructor(...args) {
    super(...args)
  }

  getParts = () => this.toLocaleDateString('fa-IR-u-nu-latn').split('/')
  getDay = () => (super.getDay() === 6 ? 0 : super.getDay() + 1)
  getDate = () => this.getParts()[2]
  getMonth = () => this.getParts()[1] - 1
  getYear = () => this.getParts()[0]
  getMonthName = () => this.toLocaleDateString('fa-IR', { month: 'long' })
  getDayName = () => this.toLocaleDateString('fa-IR', { weekday: 'long' })
}

const getNumberOfDaysFromMonth = (month) => {
  switch (month) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      return 31
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
      return 30
    case 12:
      return 29
  }
}

const createTimeListForTotalTransactions = (type, monthId) => {
  const data = []
  if (type === 'monthly') {
    monthId = parseInt(monthId)
    monthId = monthId > 12 ? 12 : monthId
    monthId = monthId < 1 ? 1 : monthId
    const numberOfDaysFromMonth = getNumberOfDaysFromMonth(monthId)
    for (let k = 1; k <= numberOfDaysFromMonth; k++) {
      const typeOfDay = String(k).length === 1 ? `0${k}` : k

      const typeOfMonth = String(monthId).length === 1 ? `0${monthId}` : monthId

      data.push({
        time: `${typeOfMonth}/${typeOfDay}`,
        debtor: 0,
        creditor: 0
      })
    }
  } else if (type === 'yearly') {
    for (let k = 1; k < 13; k++) {
      const typeOfMonth = String(k).length === 1 ? `0${k}` : String(k)
      data.push({
        time: `${typeOfMonth}`,
        debtor: 0,
        creditor: 0
      })
    }
  }
  return data
}

const createTimeList = (type, transactions = false) => {
  const dateNow = new PersianDate(Date.now())
  const BASE_CHART_TIMES_VALUE = { DAILY: 18, MONTHLY: 12, WEEKLY: 15 }
  let currentLastMonth = 12
  const data = []
  if (type === 'daily') {
    if (dateNow.getDate() > BASE_CHART_TIMES_VALUE.DAILY) {
      for (let k = 0; k <= BASE_CHART_TIMES_VALUE.DAILY; k++) {
        const typeOfMonth =
          String(dateNow.getMonth()).length === 1
            ? `0${dateNow.getMonth()}`
            : dateNow.getMonth()

        const typeOfDay =
          String(parseInt(dateNow.getDate()) - k).length === 1
            ? `0${parseInt(dateNow.getDate()) - k}`
            : parseInt(dateNow.getDate()) - k

        !transactions
          ? data.push({
              time: `${typeOfMonth}/${typeOfDay}`,
              count: 0
            })
          : data.push({
              time: `${typeOfMonth}/${typeOfDay}`,
              debtor: 0,
              creditor: 0
            })
      }
    } else {
      const daysOfPreviousMonth = getNumberOfDaysFromMonth(
        dateNow.getMonth() === 1 ? 12 : dateNow.getMonth() - 1
      )

      for (let k = 0; k <= dateNow.getDate(); k++) {
        const typeOfMonth =
          String(dateNow.getMonth()).length === 1
            ? `0${dateNow.getMonth()}`
            : dateNow.getMonth()

        const typeOfDay =
          String(parseInt(dateNow.getDate()) - k).length === 1
            ? `0${parseInt(dateNow.getDate()) - k}`
            : parseInt(dateNow.getDate()) - k
        !transactions
          ? data.push({
              time: `${typeOfMonth}/${typeOfDay}`,
              count: 0
            })
          : data.push({
              time: `${typeOfMonth}/${typeOfDay}`,
              debtor: 0,
              creditor: 0
            })
      }
      for (let k = 0; k <= BASE_CHART_TIMES_VALUE.DAILY - data.length; k++) {
        const currentMonth = `${
          dateNow.getMonth() === 1 ? 12 : parseInt(dateNow.getMonth()) - 1
        }`

        const typeOfMonth =
          String(currentMonth).length === 1 ? `0${currentMonth}` : currentMonth

        const typeOfDay =
          String(parseInt(daysOfPreviousMonth) - k).length === 1
            ? `0${parseInt(daysOfPreviousMonth) - k}`
            : parseInt(daysOfPreviousMonth) - k

        !transactions
          ? data.push({
              time: `${typeOfMonth}/${typeOfDay}`,
              count: 0
            })
          : data.push({
              time: `${typeOfMonth}/${typeOfDay}`,
              debtor: 0,
              creditor: 0
            })
      }
    }
  } else if (type === 'weekly') {
    let lastMonth = dateNow.getMonth()
    let daysOfMonth = dateNow.getDate()
    for (let k = 0; k <= BASE_CHART_TIMES_VALUE.WEEKLY; k++) {
      if (data.length === BASE_CHART_TIMES_VALUE.WEEKLY) break

      daysOfMonth = daysOfMonth - 7

      if (daysOfMonth <= 0) {
        lastMonth = lastMonth === 1 ? 12 : lastMonth - 1

        daysOfMonth =
          getNumberOfDaysFromMonth(lastMonth) + parseInt(daysOfMonth)
      }

      const typeOfMonth =
        String(lastMonth).length === 1 ? `0${lastMonth}` : lastMonth

      const typeOfDay =
        String(daysOfMonth).length === 1 ? `0${daysOfMonth}` : daysOfMonth

      !transactions
        ? data.push({
            time: `${typeOfMonth}/${typeOfDay}`,
            count: 0
          })
        : data.push({
            time: `${typeOfMonth}/${typeOfDay}`,
            debtor: 0,
            creditor: 0
          })
    }
  } else if (type === 'monthly') {
    let isResetMonth = false
    for (let k = 0; k <= BASE_CHART_TIMES_VALUE.MONTHLY; k++) {
      if (data.length === BASE_CHART_TIMES_VALUE.MONTHLY) break

      if (dateNow.getMonth() - k < 1) {
        k = 0
        currentLastMonth = currentLastMonth - k

        const typeOfMonth =
          String(currentLastMonth).length === 1
            ? `0${parseInt(currentLastMonth)}`
            : currentLastMonth

        !transactions
          ? data.push({
              time: String(typeOfMonth),
              count: 0
            })
          : data.push({
              time: String(typeOfMonth),
              debtor: 0,
              creditor: 0
            })

        isResetMonth = true
        continue
      }
      if (isResetMonth) {
        currentLastMonth--

        const typeOfMonth =
          String(currentLastMonth).length === 1
            ? `0${parseInt(currentLastMonth)}`
            : currentLastMonth

        !transactions
          ? data.push({
              time: String(typeOfMonth),
              count: 0
            })
          : data.push({
              time: String(typeOfMonth),
              debtor: 0,
              creditor: 0
            })
        continue
      }

      const typeOfMonth =
        String(parseInt(dateNow.getMonth()) - k).length === 1
          ? `0${parseInt(dateNow.getMonth()) - k}`
          : parseInt(dateNow.getMonth()) - k

      !transactions
        ? data.push({
            time: String(typeOfMonth),
            count: 0
          })
        : data.push({
            time: String(typeOfMonth),
            debtor: 0,
            creditor: 0
          })
    }
  }
  return data
}

const dateFormat = (date) => (String(date).length === 1 ? `0${date}` : date)

const iranProvinces = () => {
  return [
    'کهکیلویه و بویر احمد',
    'سیستان و بلوچستان',
    'خراسان شمالی',
    'خراسان رضوی',
    'خراسان جنوبی',
    'چهار محال و بختیاری',
    'آذربایجان غربی',
    'آذربایجان شرقی',
    'اصفهان',
    'اردبیل',
    'ایلام',
    'بوشهر',
    'تهران',
    'خوزستان',
    'زنجان',
    'سمنان',
    'فارس',
    'قزوین',
    'قم',
    'البرز',
    'کردستان',
    'کرمان',
    'کرمانشاه',
    'گلستان',
    'گیلان',
    'لرستان',
    'مازندران',
    'مرکزی',
    'هرمزگان',
    'همدان',
    'یزد'
  ]
}

module.exports = {
  timestampToIso,
  isoToTimestamp,
  camelCase,
  createTimeList,
  PersianDate,
  dateFormat,
  iranProvinces,
  createTimeListForTotalTransactions
}
