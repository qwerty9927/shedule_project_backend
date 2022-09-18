const jwt = require("jsonwebtoken")
const createError = require('http-errors')

module.exports = function verifyTokenAdmin(req, res, next){
  try{
    const [schema, token] = req.headers.authorization.split(' ')
    jwt.verify(token, process.env.ACCEPT_TOKEN, (err, data) => {
      if(data.Role === 1){
        next()
      } else {
        next(createError.Unauthorized())
      }
    })
  } catch (err){
    next(createError.Unauthorized())
  }
  
}