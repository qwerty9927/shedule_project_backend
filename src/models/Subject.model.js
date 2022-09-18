const { ObjectId } = require('mongodb')
const fs = require('fs')
const Schema = require('./Schema.model')
const createModel = require('../services/createModel.service')
require('../utils/dbTool')
require('dotenv').config()
class SubjectModel {
  async insertSubject(data, docInfo) {
    const collName = docInfo.school.toLowerCase()
    const name = `${collName}_${docInfo.schoolYear.toLowerCase()}_${docInfo.code.toLowerCase()}`
    const Model = createModel(collName, Schema.subjectSchema)
    try {
      await Model.updateOne({ Name: name }, { $push: { Subject: data.values } })
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  handleData(data) {
    const dataHandled = {}
    const pattern = "Subject.$"
    Object.keys(data).forEach(item => {
      dataHandled[`${pattern}.${item}`] = data[item]
    })
    return dataHandled
  }

  async updateSubject(data, docInfo) {
    const collName = docInfo.school.toLowerCase()
    const name = `${collName}_${docInfo.schoolYear.toLowerCase()}_${docInfo.code.toLowerCase()}`
    const Model = createModel(collName, Schema.subjectSchema)
    const values = this.handleData(data.values)
    try {
      await Model.updateOne({ Name: name, "Subject._id": ObjectId(data.idSubject) }, values)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async deleteSubject(id, docInfo) {
    const collName = docInfo.school.toLowerCase()
    const name = `${collName}_${docInfo.schoolYear.toLowerCase()}_${docInfo.code.toLowerCase()}`
    const Model = createModel(collName, Schema.subjectSchema)
    try {
      await Model.updateOne({ Name: name }, { $pull: { Subject: { _id: ObjectId(id) } } })
    } catch (err) {
      console.log(err)
      throw err
    }

  }

  async getSubject(docInfo) {
    const name = `${docInfo.school.toLowerCase()}_${docInfo.schoolYear.toLowerCase()}_${docInfo.code.toLowerCase()}`
    const Model = createModel(docInfo.school.toLowerCase(), Schema.subjectSchema)
    const isExists = await Model.exists({ Name: name })
    if (isExists) {
      const result = await Model.find()
      return result[0].Subject
    } else {
      throw new Error("error db")
    }
  }

  async searchSubject(searchInfo, docInfo) {
    const result = []
    const indexStartSearch = 2
    const indexNameSubject = 1
    let sizeNeed = process.env.DB_DEFAULT_COUNT_SELECT // support for limit

    try {
      const path = __basedir + `\\src\\docs\\${docInfo.school}.txt`
      const data = fs.readFileSync(path, "utf8")
      const array = data.split('#').map(itemRoot => {
        const temp = itemRoot.split('\r\n')
        for(let i = indexStartSearch;i < temp.length - 1;i++){
          const compareArr = temp[i].toLowerCase().split('*')
          if (compareArr[0].startsWith(searchInfo.value) || compareArr[1].startsWith(searchInfo.value)) {
            return temp[indexNameSubject]
          }
        }
      })
      console.log(array)
      for (let i of array) {
        if (i) {
          const name = `${docInfo.school.toLowerCase()}_${docInfo.schoolYear.toLowerCase()}_${i.toLowerCase()}`
          const Model = createModel(docInfo.school.toLowerCase(), Schema.subjectSchema)
          const subResult = await Model.find({
            Name: name,
            $or: [
              {
                "Subject.MaMH": { $regex: `${searchInfo.value}.*`, $options: 'i' }
              },
              {
                "Subject.TenMH": { $regex: `${searchInfo.value}.*`, $options: 'i' }
              }
            ]
          })
          if(subResult.length){
            result.push(...subResult[0].Subject)
          }
        }
      }
      return result.skip((searchInfo.page - 1) * process.env.DB_DEFAULT_COUNT_SELECT)
        .limit(process.env.DB_DEFAULT_COUNT_SELECT)
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

module.exports = new SubjectModel()