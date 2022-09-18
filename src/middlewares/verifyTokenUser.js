const jwt = require("jsonwebtoken")
const createError = require('http-errors')

module.exports = function verifyTokenUser(req, res, next){
  try{
    const [schema, token] = req.headers.authorization.split(' ')
    jwt.verify(token, process.env.ACCEPT_TOKEN, (err, data) => {
      if(data.Role === 2){
        req.idShedule = data.idShedule
        next()
      } else {
        next(createError.Unauthorized())
      }
    })
  } catch (err){
    next(createError.Unauthorized())
  }
  
}