const Doctor = require("../models/Doctor");
const Department = require("../models/Department");
const User = require("../models/User");

// Tạo bác sĩ mới
exports.createDoctor = async (req, res) => {
  const { userId, age, gender, contact, departmentId } = req.body;

  try {
    // Kiểm tra xem user có tồn tại không
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Kiểm tra role của user, nếu không phải doctor thì trả về lỗi
    if (existingUser.role !== "doctor") {
      return res
        .status(403)
        .json({ msg: "Unauthorized to create doctor record for this user" });
    }

    // Kiểm tra xem bác sĩ đã tồn tại chưa dựa trên userId
    let doctor = await Doctor.findOne({ user: userId });

    if (doctor) {
      return res.status(400).json({ msg: "Doctor record already exists" });
    }

    // Tìm department
    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({ msg: "Department not found" });
    }

    // Tạo hồ sơ bác sĩ mới
    doctor = new Doctor({
      user: userId, // Liên kết với userId của bác sĩ
      age,
      gender,
      contact,
      department: departmentId,
    });

    await doctor.save();

    res.json({ msg: "Doctor created successfully", doctor });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Xem tất cả bác sĩ
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("department", "name")
      .populate("user", "name email");
    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Xem chi tiết một bác sĩ
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("department", "name")
      .populate("user", "name email");

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Cập nhật thông tin bác sĩ
exports.updateDoctor = async (req, res) => {
  const { age, gender, contact, departmentId } = req.body;

  try {
    let doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    // Cập nhật các thông tin nếu có thay đổi
    if (age) doctor.age = age;
    if (gender) doctor.gender = gender;
    if (contact) doctor.contact = contact;

    if (departmentId) {
      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(404).json({ msg: "Department not found" });
      }
      doctor.department = departmentId;
    }

    await doctor.save();

    res.json({ msg: "Doctor updated successfully", doctor });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
