const createError = require('http-errors')
const SubjectModel = require('../models/Subject.model')

class Subject {
  async getSubject(req, res, next){
    const { school, schoolYear, code } = req.query
    try {
      const result = await SubjectModel.getSubject({ school, schoolYear, code })
      res.status(200).json({
        status: 200,
        result
      })
    } catch(err){
      console.log(err)
      next(createError.InternalServerError())
    }
  }

  async addSubject(req, res, next) {
    const { school, schoolYear, code } = req.query
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
    const { school, schoolYear, code } = req.query
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
    const { school, schoolYear, code, id } = req.query
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