const Doctor = require("../models/Doctor");
const Department = require("../models/Department");

// Tạo bác sĩ mới
exports.createDoctor = async (req, res) => {
  const { name, email, phone, address, departmentId } = req.body;

  try {
    let doctor = await Doctor.findOne({ email });

    if (doctor) {
      return res.status(400).json({ msg: "Doctor already exists" });
    }

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({ msg: "Department not found" });
    }

    doctor = new Doctor({
      name,
      email,
      phone,
      address,
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
    const doctors = await Doctor.find().populate("department", "name");
    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Xem chi tiết một bác sĩ
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "department",
      "name"
    );

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
  const { name, email, phone, address, departmentId } = req.body;

  try {
    let doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    // Cập nhật các thông tin
    if (name) doctor.name = name;
    if (email) doctor.email = email;
    if (phone) doctor.phone = phone;
    if (address) doctor.address = address;

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
