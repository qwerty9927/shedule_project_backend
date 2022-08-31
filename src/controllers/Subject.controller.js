const createError = require('http-errors')
const SubjectModel = require('../models/Subject.model')

class Subject {
  async addSubject(req, res, next) {
    const { school, schoolYear, code } = req.params
    const data = req.body
    try {
      await SubjectModel.insertSubject(data, { school, schoolYear, code })
      res.status(200).json({
        status: 200,
        meg: "Success"
      })
    } catch (err) {
      console.log(err)
      next(createError.InternalServerError())
    }

  }

  async editSubject(req, res, next) {
    const { school, schoolYear, code } = req.params
    const data = req.body
    try {
      await SubjectModel.updateSubject(data, { school, schoolYear, code })
      res.status(200).json({
        status: 200,
        meg: "Success"
      })
    } catch (err) {
      console.log(err)
      next(createError.InternalServerError())
    }
  }

  async deleteSubject(req, res, next) {
    const { school, schoolYear, code, id } = req.params
    try {
      await SubjectModel.deleteSubject(id, { school, schoolYear, code })
      res.status(200).json({
        status: 200,
        meg: "Success"
      })
    } catch (err) {
      console.log(err)
      next(createError.InternalServerError())
    }
  }

}

module.exports = new Subject()