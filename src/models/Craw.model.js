const DB = require("./DB.model");
const createModel = require('../services/model.service')
const Schema = require("./Schema.model")

class CrawModel extends DB {
  constructor() {
    super()
  }


  receiveData(data, code, schoolYear) {
    createModel(`sgu_${schoolYear.toLowerCase()}_${code.toLowerCase()}`, Schema.subjectSchema)
    .insertMany(data, (err) => {
      if (err) {
        console.log("err: ", err)
      }
    })

  }
}

module.exports = new CrawModel()