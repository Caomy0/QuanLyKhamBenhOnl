const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Liên kết với model User
    required: true,
  },
  age: Number,
  gender: String,
  contact: {
    phone: String,
    address: String,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department", // Liên kết với model Department
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Doctor", DoctorSchema);
