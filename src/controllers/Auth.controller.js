const createError = require('http-errors')
class Auth{
  login(req, res, next){
    const data = req.body
    if(data.Username && data.Password) {
      try { 
        
      } catch(err){
        console.log(err)
        next(createError.InternalServerError())
      }
    } else {
      next(createError.UnprocessableEntity())
    }
  }
}

module.exports = new Auth()