const createError = require('http-errors')
const CrawModel = require('../models/Craw.model')

class Craw{
  receiveData(req, res, next){
    const data = JSON.parse(req.body.values)
    const {code, schoolYear, school} = req.query
    const obj = data.map((item, index) => {
      return {
        MaMH: item[1],
        TenMH: item[2],
        NMH: item[3], 
        TTH: item[4],
        STC: item[5],
        STCHP: item[6],
        MaLop: item[7],
        SiSo: item[8], 
        CL: item[9],
        TH: item[10],
        Thu: item[11],
        TBD: item[12],
        ST: item[13],
        GiangVien: item[14],
        Tuan: item[15]
      }
    })
    try{
      CrawModel.receiveData(obj, {code, schoolYear, school})
      res.sendStatus(200)
    } catch(e){
      next(createError.InternalServerError())
    }
  }
}

module.exports = new Craw()