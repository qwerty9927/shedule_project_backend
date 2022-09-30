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
      Tuan: Array,
      CS: Array
    }
  ],
})

const sheduleSchema = new Schema({
  ListShedule: [
    {
      NameTable: String,
      // ListSubject: Array,
      Shedule: [{
        Name: String,
        // idSubject: ObjectId,
        MaMH: String,
        NMH: String,
        Thu: Array,
        TBD: Array,
        ST: Array,
        CS: Array,
        Color: String
      }],
      EmptyTime: {
        2: Array,
        3: Array,
        4: Array,
        5: Array,
        6: Array,
        7: Array
      }
    }
  ],
  QuantityShedule: Number
})

const loginSchema_1 = new Schema({
  Email: String,
  Password: String,
  Fullname: String,
  Image: String,
  Role: Number,
  idShedule: ObjectId
},{
  timestamps: true
})

const loginSchema_2 = new Schema({
  Email: String,
  Fullname: String,
  Image: String,
  Role: Number,
  idShedule: ObjectId
},{
  timestamps: true
})

module.exports = { subjectSchema, loginSchema_1, loginSchema_2, sheduleSchema }