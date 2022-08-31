const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

class DB{
  constructor(){
    mongoose.connect(process.env.URLDB, {}, (err) => {
      if(err){
        console.log("Error database!")
        console.log(err)
      } else {
        this.connection = mongoose.connection
        console.log("Connect success")
      }
    })
  }
}

module.exports = DB