const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
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
