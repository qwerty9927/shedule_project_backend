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

  subjectIsExist(MAMH, listSubject){
    listSubject.forEach(item => {
      if(item === MAMH){
        throw new Error("Subject existed!")
      }
    })
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
      if(!timeInDay.length){
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
          console.log(timeInDay)
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
          timeArr[`${item}`] =  timeInDay.fill(CS[index], indexForTBD, TKT)
        } else {
          throw new Error("Different area error")
        }
      }
    })
    console.log(timeArr)
    return timeArr
  }

  async actionAdd(data, MAMH, listEmptyTime){
    try {
      const ModelShedule = createModel(process.env.SHEDULE_COLLECTION, Schema.sheduleSchema)
      await ModelShedule.updateOne(
        {
          _id: ObjectId(data.idShedule),
          "ListShedule._id": ObjectId(data.idTable),
        },
        { $push: { "ListShedule.$.Shedule": data.idSubject, "ListShedule.$.ListSubject": MAMH }, "ListShedule.$.EmptyTime": listEmptyTime }
      )
    } catch (err) {
      throw err
    }
  }

  async addSubjectOfTable(data, docInfo) {
    const collName = docInfo.school.toLowerCase()
    const name = `${collName}_${docInfo.schoolYear.toLowerCase()}_${docInfo.code.toLowerCase()}`
    try {
      const ModelSgu = createModel(collName, Schema.subjectSchema)
      const ModelShedule = createModel(process.env.SHEDULE_COLLECTION, Schema.sheduleSchema)
      const result = (await ModelSgu.find({ Name: name, "Subject._id": ObjectId(data.idSubject) }, { "Subject.$": 1 }))
      console.log(result)
      if(result.length){
        const resultTable = (await ModelShedule.find({ _id: ObjectId(data.idShedule), "ListShedule._id": ObjectId(data.idTable) }, {"ListShedule.$": 1}))
        const subResult = result[0].Subject[0]
        const listSubject = resultTable[0].ListShedule[0].ListSubject
        const listEmptyTime = resultTable[0].ListShedule[0].EmptyTime

        this.subjectIsExist(subResult.MaMH, listSubject)
        const newListEmptyTime = this.checkSlot(subResult.Thu, subResult.TBD, subResult.ST, subResult.CS, listEmptyTime)
        await this.actionAdd(data, subResult.MaMH, newListEmptyTime)
      } else {
        throw new Error("Subject not exist!")
      }
    } catch(err){
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

  async deleteSubjectOfTable(data) {
    try {
      const Model = createModel(process.env.SHEDULE_COLLECTION, Schema.sheduleSchema)
      await Model.updateOne(
        { _id: ObjectId(data.idShedule), "ListShedule._id": ObjectId(data.idTable) },
        { $pull: { "ListShedule.$.Shedule": { idSubject: data.idSubject } } })
    } catch (err) {
      throw err
    }
  }
}

module.exports = new SheduleModel()