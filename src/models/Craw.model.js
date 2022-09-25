const createModel = require('../services/createModel.service')
const Schema = require("./Schema.model")

class CrawModel {
  async receiveData(data, collInfo) {
    const name = `${collInfo.school.toLowerCase()}_${collInfo.schoolYear.toLowerCase()}_${collInfo.code.toLowerCase()}`
    console.log(data)
    try {
      const Model = createModel(collInfo.school.toLowerCase(), Schema.subjectSchema)
      const isExists = await Model.exists({Name: name})
      if(isExists){
        const docs = await Model.find({Name: name})
        if(docs){
          await Model.updateOne({Name: name}, {Subject: docs[0].Subject.concat(data)})
        }
      } else {
        const row = new Model()
        row.Name = name
        row.Subject = data
        row.save((err) => {
          console.log(err)
        })
      }
    } catch(err){
      console.log(err)
      throw err
    }
  }
}

module.exports = new CrawModel()