const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subjectSchema = new Schema({
  MaMH: String,
  TenMH: String,
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
  GiangVien: Array,
  Tuan: Array
})

module.exports = { subjectSchema }