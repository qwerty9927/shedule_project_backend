const createError = require('http-errors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const AuthModel = require('../models/Auth.model')
const verifyResgister = require('../middlewares/verifyResgister')
class Auth {
  async login(req, res, next) {
    const data = req.body
    if (data.Email && data.Password) {
      try {
        let accessToken, refreshToken
        const result = await AuthModel.findUser(data)
        if (result) {
          const isMatch = await bcrypt.compare(data.Password, result.Password)
          if (isMatch) {
            accessToken = jwt.sign({
              Email: result.Email,
              Role: result.Role
            }, process.env.ACCEPT_TOKEN, { expiresIn: 60 })
            refreshToken = jwt.sign({
              Email: result.Email,
              Role: result.Role
            }, process.env.REFRESH_TOKEN, { expiresIn: 60 * 10 })
            await AuthModel.setRefreshToken(result.Email, refreshToken)
          }
          res.cookie("accessToken", accessToken)
          res.cookie("refreshToken", refreshToken)
          res.status(200).json({ status: 200, meg: "Success" })
        } else {
          next(createError.Unauthorized())
        }
      } catch (err) {
        console.log(err)
        next(createError.InternalServerError())
      }
    } else {
      next(createError.InternalServerError())
    }
  }

  async resgister(req, res, next) {
    const data = req.body
    if (await verifyResgister(data)) {
      try {
        const newData = { 
          ...data, 
          Image: "defaultImage.png", 
          Role: 2, 
          CountShedule: 0, 
          Shedule: null 
        }
        delete newData.RePassword
        await AuthModel.resgister(newData)
        res.status(200).json({ status: 200, meg: "Success" })
      } catch (err) {
        console.log(err)
        next(createError.InternalServerError())
      }
    } else {
      next(createError.InternalServerError())
    }
  }

  refreshToken(req, res, next){
    const token = req.cookies.refreshToken
    try { 
      let accessToken
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, data) => {
        if (data && token === await AuthModel.getRefreshToken(data.Email)) {
          accessToken = jwt.sign({ Email: data.Email, Role: data.Role }, process.env.ACCEPT_TOKEN, { expiresIn: 60 })
        } else {
          throw err
        }
      })
      res.cookie("accessToken", accessToken)
      res.status(200).json({ status: 200, meg: "Success" })
    } catch(err){
      next(createError.Unauthorized())
    }
  }
}

module.exports = new Auth()