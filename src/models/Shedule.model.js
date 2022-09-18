const Schema = require('./Schema.model')
const { ObjectId } = require('mongodb')
const createModel = require('../services/createModel.service')
class SheduleModel {

  async createTable(idShedule, docInfo) {
    try {
      console.log(idShedule, docInfo)
      const ModelShedule = createModel(process.env.SHEDULE_COLLECTION, Schema.sheduleSchema)
      const updated = await ModelShedule.findOneAndUpdate(
        { _id: ObjectId(idShedule), QuantityShedule: { $lt: process.env.MAX_SIZE_SHEDULE } },
        { $push: { ListShedule: { NameTable: docInfo.nameTable } }, $inc: { QuantityShedule: 1 } },
        { new: true }
      )
      console.log(updated)
      const idNeed = updated.ListShedule[updated.ListShedule.length - 1]._id
      return idNeed
    } catch (err) {
      throw err
    }
  }

  async addSubjectOfTable(data, docInfo) {
    const collName = docInfo.school.toLowerCase()
    const name = `${collName}_${docInfo.schoolYear.toLowerCase()}_${docInfo.code.toLowerCase()}`
    try {
      const ModelSgu = createModel(collName, Schema.subjectSchema)
      const result = await ModelSgu.find({ Name: name, "Subject._id": ObjectId(data.idSubject) }).count()
      if (result) {
        const ModelShedule = createModel(process.env.SHEDULE_COLLECTION, Schema.sheduleSchema)
        await ModelShedule.updateOne(
          {
            _id: ObjectId(data.idShedule),
            "ListShedule._id": ObjectId(data.idTable),
          },
          { $push: { "ListShedule.$.ListSubject": { Name: name, idSubject: data.idSubject } } }
        )
        return true
      } else {
        return false
      }
    } catch (err) {
      throw err
    }
  }

  async deleteTable(data) {
    try {
      const Model = createModel(process.env.SHEDULE_COLLECTION, Schema.sheduleSchema)
      await Model.updateOne(
        { _id: ObjectId(data.idShedule) },
        { $inc: { QuantityShedule: -1 }, $pull: { ListShedule: { _id: ObjectId(data.idTable) } } })
    } catch (err) {
      throw err
    }
  }

  async deleteSubjectOfTable(data) {
    try {
      const Model = createModel(process.env.SHEDULE_COLLECTION, Schema.sheduleSchema)
      await Model.updateOne(
        { _id: ObjectId(data.idShedule), "ListShedule._id": ObjectId(data.idTable) },
        { $pull: { "ListShedule.$.ListSubject": { idSubject: data.idSubject } } })
    } catch (err) {
      throw err
    }
  }
}

module.exports = new SheduleModel()