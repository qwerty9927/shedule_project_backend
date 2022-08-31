const DB = require("./DB.model");
const createModel = require('../services/interact.service')
const Schema = require("./Schema.model")

class CrawModel extends DB {
  constructor() {
    super()
  }


  receiveData(data, collInfo) {
    createModel(`${collInfo.school}_${collInfo.schoolYear.toLowerCase()}_${collInfo.code.toLowerCase()}`, Schema.subjectSchema)
    .insertMany(data, (err) => {
      if (err) {
        console.log("err: ", err)
      }
    })

  }
}

module.exports = new CrawModel()