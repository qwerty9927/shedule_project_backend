const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subjectSchema = new Schema({
  Name: { type: String, required: true },
  Subject: [
    {
      MaMH: { type: String, required: true },
      TenMH: { type: String, required: true },
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
    }
  ],
})

const sheduleSchema = new Schema({
  ListShedule: [
    {
      Name: String,
      NameShedule: String,
      idSubject: ObjectId
    }
  ]
})

const loginSchema_1 = new Schema({
  Email: String,
  Password: String,
  Fullname: String,
  Image: String,
  Role: Number,
  CountShedule: Number,
  Shedule: ObjectId
},{
  timestamps: true
})

const loginSchema_2 = new Schema({
  Email: String,
  Fullname: String,
  Image: String,
  Role: Number,
  CountShedule: Number,
  Shedule: ObjectId
},{
  timestamps: true
})

module.exports = { subjectSchema, loginSchema_1, loginSchema_2, sheduleSchema }