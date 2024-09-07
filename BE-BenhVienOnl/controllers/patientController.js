const Patient = require("../models/Patient");
const User = require("../models/User");

// Tạo bệnh nhân mới
exports.createPatient = async (req, res) => {
  const { user, age, gender, medicalHistory, phone, address } = req.body;

  try {
    // Kiểm tra xem user có tồn tại không
    const existingUser = await User.findById(user);

    if (!existingUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Kiểm tra xem user này đã có hồ sơ bệnh nhân chưa
    const existingPatient = await Patient.findOne({ user });

    if (existingPatient) {
      return res.status(400).json({ msg: "Patient record already exists" });
    }

    const patient = new Patient({
      user,
      age,
      gender,
      medicalHistory,
      contact: {
        phone,
        address,
      },
    });

    await patient.save();

    res.status(201).json({ msg: "Patient created successfully", patient });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Xem tất cả bệnh nhân
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate("user", "name email");

    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Xem chi tiết một bệnh nhân
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Cập nhật thông tin bệnh nhân
exports.updatePatient = async (req, res) => {
  const { age, gender, medicalHistory, phone, address } = req.body;

  try {
    let patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    // Cập nhật thông tin bệnh nhân
    if (age) patient.age = age;
    if (gender) patient.gender = gender;
    if (medicalHistory) patient.medicalHistory = medicalHistory;
    if (phone) patient.contact.phone = phone;
    if (address) patient.contact.address = address;

    patient = await patient.save();

    res.json({ msg: "Patient updated successfully", patient });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Xóa bệnh nhân
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    await patient.remove();

    res.json({ msg: "Patient deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
