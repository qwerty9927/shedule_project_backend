const DB = require("./DB.model");
const createModel = require('../services/createModel.service')
const Schema = require("./Schema.model")

class CrawModel extends DB {
  constructor() {
    super()
  }

  receiveData(data, collInfo) {
    const collName = `${collInfo.school}_${collInfo.schoolYear.toLowerCase()}_${collInfo.code.toLowerCase()}`
    createModel(collName, Schema.subjectSchema)
    .insertMany(data, (err) => {
      if (err) {
        console.log("err: ", err)
      }
    })

  }
}

module.exports = new CrawModel()