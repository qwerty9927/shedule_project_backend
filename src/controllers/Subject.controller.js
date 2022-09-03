const createError = require('http-errors')
const SubjectModel = require('../models/Subject.model')

class Subject {

  async addSubject(req, res, next) {
    const { school, schoolYear, code } = req.query
    const data = req.body
    if (school && schoolYear && code && data) {
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
    } else {
      next(createError.UnprocessableEntity())
    }
  }

  async editSubject(req, res, next) {
    const { school, schoolYear, code } = req.query
    const data = req.body
    if (school && schoolYear && code && data) {
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
    } else {
      next(createError.UnprocessableEntity())
    }
  }

  async deleteSubject(req, res, next) {
    const { school, schoolYear, code, id } = req.query
    if (school && schoolYear && code && id) {
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
    } else {
      next(createError.UnprocessableEntity())
    }
  }

  async getSubject(req, res, next) {
    const { school, schoolYear, code } = req.query
    if (school && schoolYear && code) {
      try {
        const result = await SubjectModel.getSubject({ school, schoolYear, code })
        res.status(200).json({
          status: 200,
          result
        })
      } catch (err) {
        console.log(err)
        next(createError.InternalServerError())
      }
    } else {
      next(createError.UnprocessableEntity())
    }
  }

  async searchSubject(req, res, next) {
    const { value, page, school, schoolYear } = req.query
    if (value && page && school && schoolYear) {
      try {
        const result = await SubjectModel.searchSubject({ value, page }, { school, schoolYear })
        res.status(200).json({
          status: 200,
          result
        })
      } catch (err) {
        console.log(err)
        throw err
      }
    } else {
      next(createError.UnprocessableEntity())
    }
  }

  async addSubjectOfShedule(req, res, next) {
    const { school, schoolYear, code } = req.query
    const data = req.body
    if (school && schoolYear && code && data) {
      try {
        await SubjectModel.addSubjectOfShedule(data, { school, schoolYear, code })
        res.send(200).json({
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

module.exports = new Subject()