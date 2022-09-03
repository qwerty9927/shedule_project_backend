const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subjectSchema = new Schema({
  Name: {type: String, required: true},
  Subject: [{
    MaMH: {type: String, required: true},
    TenMH: {type: String, required: true},
    NMH: String, 
    TTH: String,
    STC: Number,
    STCHP: Number,
    MaLop: String,
    SiSo: String, 
    CL: String,
    TH: String,
    Thu: Array,
    TBD: Array,
    ST: Array,
    Phong: Array,
    GiangVien: Array,
    Tuan: Array
  }],
})

const sheduleShema =  new Schema({
  Subject: Map,
  Style: Number
})

module.exports = { subjectSchema, sheduleShema }