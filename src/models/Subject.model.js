const { ObjectId } = require('mongodb')
const DB = require('./DB.model')
const Schema = require('./Schema.model')
const createModel = require('../services/createModel.service')
class SubjectModel extends DB {
  constructor() {
    super()
  }

  static checkIsExists(_this, collName){
    return new Promise((resolve) => {
      _this.connection.db.listCollections({ name: collName })
        .next(async (err, coll) => {
          if (coll) {
            resolve(true)
          } else {
            console.log("Collection not exisis")
            resolve(false)
          }
        })
    })
  }

  async getSubject(collInfo){
    const collName = `${collInfo.school}_${collInfo.schoolYear.toLowerCase()}_${collInfo.code.toLowerCase()}` + "s"
    const isExists = SubjectModel.checkIsExists(this, collName)
    if(isExists){
      const result = createModel(collName, Schema.subjectSchema).find()
      console.log(result)
      return result
    } else {
      throw new Error("error db")
    }
  }

  async insertSubject(data, collInfo) {
    const collName = `${collInfo.school}_${collInfo.schoolYear.toLowerCase()}_${collInfo.code.toLowerCase()}` + "s"
    const isExists = SubjectModel.checkIsExists(this, collName)
    if (isExists) {
      const coll = createModel(collName, Schema.subjectSchema)
      try {
        await coll.create(data)
      } catch (err) {
        console.log(err)
        throw err
      }
    } else {
      throw new Error("error db")
    }
  }

  async updateSubject(data, collInfo) {
    const collName = `${collInfo.school}_${collInfo.schoolYear.toLowerCase()}_${collInfo.code.toLowerCase()}` + "s"
    const isExists = SubjectModel.checkIsExists(this, collName)
    if (isExists) {
      const coll = createModel(collName, Schema.subjectSchema)
      try {
        await coll.updateOne({ _id: data._id }, { $set: data.values })
      } catch (err) {
        console.log(err)
        throw err
      }
    } else {
      throw new Error("error db")
    }
  }

  async deleteSubject(id, collInfo) {
    const collName = `${collInfo.school}_${collInfo.schoolYear.toLowerCase()}_${collInfo.code.toLowerCase()}` + "s"
    const isExists = SubjectModel.checkIsExists(this, collName)
    if (isExists) {
      const coll = createModel(collName, Schema.subjectSchema)
        const result = await coll.deleteOne({ _id: ObjectId(id) })
        if(!result.deletedCount){
          throw new Error("none exists")
        }
    } else {
      throw new Error("error db")
    }
  }
}

module.exports = new SubjectModel()