const Schema = require('../models/Schema.model')
const createModel = require('../services/createModel.service')
module.exports = async function verifyResgister(data){
  if(data.Email && data.Password && data.RePassword && data.Fullname){
    if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.Email)){
      const Model = createModel(process.env.LOGIN_1_COLLECTION, Schema.loginSchema_1)
      const result = await Model.findOne({Email: data.Email})
      if(result){
        console.log(0)
        return false
      }
    } else {
      console.log(1)
      return false
    }
    if(!/^.{8,}$/.test(data.Password)){
      console.log(2)
      return false
    }
    if(data.Password !== data.RePassword){
      console.log(3)
      return false
    }
    return true
  } else {
    return false
  }
}