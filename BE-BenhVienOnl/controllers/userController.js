const User = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/mailer");
const Department = require("../models/Department");

// Register user
exports.registerUser = async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
      role,
      phone,
      address,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ msg: "Đăng ký thành công" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
// Cập nhật mật khẩu người dùng
exports.updatePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    // Tìm kiếm người dùng theo ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // So sánh mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect old password" });
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Tìm kiếm người dùng theo email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Tạo mật khẩu mới ngẫu nhiên với 6 ký tự
    const newPassword = crypto.randomBytes(3).toString("hex"); // Tạo chuỗi 6 ký tự

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    // Gửi mật khẩu mới qua email
    await sendEmail(
      user.email,
      "Your New Password",
      `Your new password is: ${newPassword}\nPlease log in and change your password immediately.`
    );

    res.json({ msg: "A new 6-character password has been sent to your email" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
// Lấy thông tin người dùng theo vai trò
exports.getUserByIdAndRole = async (req, res) => {
  const { id, role } = req.params;

  try {
    // Tìm kiếm người dùng theo ID và vai trò (role)
    const user = await User.findOne({ _id: id, role });

    if (!user) {
      return res.status(404).json({ msg: "User not found or role mismatch" });
    }

    // Trả về thông tin người dùng, ẩn đi mật khẩu
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
// Cập nhật thông tin người dùng theo vai trò
exports.updateUserByIdAndRole = async (req, res) => {
  const { id, role } = req.params;
  const { name, email, phone, address } = req.body;

  try {
    // Tìm kiếm người dùng theo ID và vai trò
    let user = await User.findOne({ _id: id, role });

    if (!user) {
      return res.status(404).json({ msg: "User not found or role mismatch" });
    }

    // Cập nhật các thông tin cá nhân nếu có
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.json({ msg: "User information updated successfully", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Cập nhật khoa của bác sĩ
exports.updateDoctorDepartment = async (req, res) => {
  const { doctorId, departmentId } = req.body;

  try {
    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    const department = await Department.findById(departmentId);

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    if (!department) {
      return res.status(404).json({ msg: "Department not found" });
    }

    // Cập nhật khoa cho bác sĩ
    doctor.department = department._id;
    await doctor.save();

    res.json({ msg: "Doctor updated with department successfully", doctor });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
