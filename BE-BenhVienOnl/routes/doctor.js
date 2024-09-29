const express = require("express");
const router = express.Router();
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
} = require("../controllers/doctorController");

// @route  POST api/doctors
// @desc   Tạo bác sĩ mới
// @access Public
router.post("/", createDoctor);

// @route  GET api/doctors
// @desc   Xem danh sách tất cả bác sĩ
// @access Public
router.get("/", getDoctors);

// @route  GET api/doctors/:id
// @desc   Xem chi tiết một bác sĩ
// @access Public
router.get("/:id", getDoctorById);

// @route  PUT api/doctors/:id
// @desc   Cập nhật thông tin bác sĩ
// @access Public
router.put("/:id", updateDoctor);

module.exports = router;
