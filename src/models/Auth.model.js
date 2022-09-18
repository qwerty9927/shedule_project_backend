
const Schema = require('./Schema.model')
const bcrypt = require('bcrypt')
const createModel = require("../services/createModel.service")
class AuthModel {
  async findUser(data){
    try {
      const Model = createModel(process.env.LOGIN_1_COLLECTION, Schema.loginSchema_1)
      const result = await Model.findOne({ Email: data.Email })
      return result
    } catch(err){
      throw err
    }
  }

  async createSheduleList(){
    try {
      const Model = createModel(process.env.SHEDULE_COLLECTION, Schema.sheduleSchema)
      const doc = await Model.create({QuantityShedule: 0})
      return doc._id
    } catch(err){
      throw err
    }
  }

  async resgister(data) {
    try {
      data.Password = await bcrypt.hash(data.Password, parseInt(process.env.SATL_ROUND))
      const Model = createModel(process.env.LOGIN_1_COLLECTION, Schema.loginSchema_1)
      await Model.create(data)
    } catch (err) {
      throw (err)
    }
  }

  async getRefreshToken(key) {
    return await global._redisConnect.get(key)
  }

  async setRefreshToken(key, value) {
    return await global._redisConnect.set(key, value)
  }
}

module.exports = new AuthModel()