const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  // Các thuộc tính khác nếu cần thiết
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Department", DepartmentSchema);
