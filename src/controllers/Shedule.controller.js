const createError = require('http-errors')
const SheduleModel = require('../models/Shedule.model')

class Shedule {

  async createTable(req, res, next) {
    const { nameTable } = req.query
    if (nameTable) {
      try {
        const idShedule = req.idShedule || "631ed00e4ad305f35e3c6b8d"
        const result = await SheduleModel.createTable(idShedule, { nameTable })
        res.status(200).json({ idTable: result })
      } catch (err) {
        console.log(err)
        next(createError.InternalServerError())
      }
    } else {
      next(createError.UnprocessableEntity())
    }
  }

  async addSubjectOfTable(req, res, next) {
    const { school, schoolYear, code } = req.query
    const data = req.body
    data.idShedule = req.idShedule || "631ed00e4ad305f35e3c6b8d"
    // data {idShedule, idTable, idSubject}
    if (school && schoolYear && code && data.idShedule && data.idTable && data.idSubject) {
      try {
        await SheduleModel.addSubjectOfTable(data, { school, schoolYear, code })
        res.status(200).json({
          status: 200,
          meg: "Success"
        })
      } catch (err) {
        console.log(err)
        next(createError(500, err))
      }
    } else {
      next(createError.UnprocessableEntity())
    }
  }

  async deleteTable(req, res, next) {
    const data = req.query
    data.idShedule = req.idShedule || "631ed00e4ad305f35e3c6b8d"
    // data {idShedule, idTable}
    if (data.idShedule && data.idTable) {
      try {
        await SheduleModel.deleteTable(data)
        res.status(200).json({
          status: 200,
          meg: "Success"
        })
      } catch (err) {
        console.log(err)
        next(createError.InternalServerError())
      }
    } else {
      next(createError.UnprocessableEntity())
    }
  }

  async deleteSubjectOfTable(req, res, next) {
    const data = req.body
    data.idShedule = req.idShedule || "631ed00e4ad305f35e3c6b8d"
    // data {idShedule, idTable, idSubject}
    if (data.idShedule && data.idTable && data.idSubject) {
      try {
        await SheduleModel.deleteSubjectOfTable(data)
        res.status(200).json({
          status: 200,
          meg: "Success"
        })
      } catch (err) {
        console.log(err)
        next(createError.InternalServerError())
      }
    } else {
      next(createError.UnprocessableEntity())
    }
  }

}

module.exports = new Shedule()