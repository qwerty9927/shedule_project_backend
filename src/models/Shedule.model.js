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

  subjectIsExist(listSubject, listSubjectInDB) {
    let i, j
    for (i of listSubject) {
      for (j of listSubjectInDB) {
        if (i.MaMH === j.MaMH) {
          throw new Error("Subject existed!")
        }
      }
    }
  }

  checkSlot(THU, TBD, ST, CS, timeArr) {
    const pivot = 5 // Chia khung giờ
    const startLessonInTheMorning = 1
    const startLessonInTheAfternoon = 6
    const beforeBreakTimeInTheMorning = 2
    const afterBreakTimeInTheMorning = 3
    const beforeBreakTimeInTheAfternoon = 7
    const afterBreakTimeInTheAfternoon = 8
    THU.forEach((item, index) => {
      const indexForTBD = TBD[index] - 1
      let i = indexForTBD
      let timeInDay = timeArr[`${item}`]
      if (!timeInDay.length) {
        timeInDay = new Array(14).fill(0)
      }
      const TKT = TBD[index] + ST[index] - 1
      const indexForTKT = TKT - 1
      if (TKT <= pivot) {
        if ((TBD[index] === startLessonInTheMorning && timeInDay[indexForTKT + 1] === CS[index])
          || timeInDay[indexForTBD - 1] === CS[index]
          || timeInDay[indexForTBD - 1] === 0
          || TBD[index] === afterBreakTimeInTheMorning
          || TKT === beforeBreakTimeInTheMorning
        ) {
          for (i; i < TKT; i++) {
            if (timeInDay[i] !== 0) {
              throw new Error("Conflict error")
            }
          }
          timeArr[`${item}`] = timeInDay.fill(CS[index], indexForTBD, TKT)
        } else {
          throw new Error("Different area error")
        }
      } else {
        if ((TBD[index] === startLessonInTheAfternoon && timeInDay[indexForTKT + 1] === CS[index])
          || timeInDay[indexForTBD - 1] === CS[index]
          || timeInDay[indexForTBD - 1] === 0
          || TBD[index] === afterBreakTimeInTheAfternoon
          || TKT === beforeBreakTimeInTheAfternoon
        ) {
          for (i; i < TKT; i++) {
            if (timeInDay[i] !== 0) {
              throw new Error("Conflict or difference error")
            }
          }
          timeArr[`${item}`] = timeInDay.fill(CS[index], indexForTBD, TKT)
        } else {
          throw new Error("Different area error")
        }
      }
    })
    return timeArr
  }

  async actionAdd(data, listSubject, listEmptyTime, Model) {
    try {
      await Model.updateMany(
        {
          _id: ObjectId(data.idShedule),
          "ListShedule._id": ObjectId(data.idTable),
        },
        {
          $push: {
            "ListShedule.$.Shedule": listSubject
          },
          "ListShedule.$.EmptyTime": listEmptyTime
        }
      )
    } catch (err) {
      throw err
    }
  }

  async isExistSubject(data, Model) {
    const accuracy = []
    for (let i of data.Subject) {
      const result = await Model.find({ "Subject.MaMH": i.MaMH, "Subject.NMH": i.NMH }, { "Subject.$": 1 })
      if (result.length) {
        const subResult = result[0].Subject[0]
        accuracy.push({ ...i, Thu: subResult.Thu, TBD: subResult.TBD, ST: subResult.ST, CS: subResult.CS })
      }
    }
    return accuracy
  }

  async saveSubjectOfTable(data, docInfo) {
    const collName = docInfo.school.toLowerCase()
    try {
      const ModelSgu = createModel(collName, Schema.subjectSchema)
      const ModelShedule = createModel(process.env.SHEDULE_COLLECTION, Schema.sheduleSchema)
      const result = await this.isExistSubject(data, ModelSgu) // subject is existed in db ?
      if (result.length) {
        const resultTable = (await ModelShedule.find({ _id: ObjectId(data.idShedule), "ListShedule._id": ObjectId(data.idTable) }, { "ListShedule.$": 1 }))
        let listEmptyTime = resultTable[0].ListShedule[0].EmptyTime
        this.subjectIsExist(result, resultTable[0].ListShedule[0].Shedule) // subject is existed in my shedule ?
        result.forEach(item => {
          listEmptyTime = this.checkSlot(item.Thu, item.TBD, item.ST, item.CS, listEmptyTime) // have slot ?
        })
        await this.actionAdd(data, result, listEmptyTime, ModelShedule) // add all
      } else {
        throw new Error("Subject not exist!")
      }
    } catch (err) {
      throw err.message
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

  changeEmptyTime(data, shedule, timeArr) {
    let arr
    shedule.forEach(rootItem => {
      console.log(rootItem)
      if (rootItem.MaMH === data.Subject.MaMH && rootItem.NMH === data.Subject.NMH) {
        rootItem.Thu.forEach((item, index) => {
          arr = timeArr[item].fill(0, rootItem.TBD[index] - 1, rootItem.TBD[index] - 1 + rootItem.ST[index])
        })
      }
    })
    return arr
  }

  async deleteSubjectOfTable(data) {
    try {
      const Model = createModel(process.env.SHEDULE_COLLECTION, Schema.sheduleSchema)
      const result = await Model.findOne({ _id: ObjectId(data.idShedule), "ListShedule._id": ObjectId(data.idTable) }, { "ListShedule.$": 1 })
      const shedule = result.ListShedule[0].Shedule
      const emptyTime = result.ListShedule[0].EmptyTime
      const newTimeArr = this.changeEmptyTime(data, shedule, emptyTime)
      await Model.updateOne(
        { _id: ObjectId(data.idShedule), "ListShedule._id": ObjectId(data.idTable) },
        { $pull: { "ListShedule.$.Shedule": { MaMH: data.Subject.MaMH, NMH: data.Subject.NMH } }, "ListShedule.$.EmptyTime": newTimeArr })

    } catch (err) {
      throw err
    }
  }
}

module.exports = new SheduleModel()