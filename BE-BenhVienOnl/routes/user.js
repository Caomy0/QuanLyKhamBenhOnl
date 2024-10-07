const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updatePassword,
  forgotPassword,
  getUserByIdAndRole,
  updateUserByIdAndRole,
  updateDoctorDepartment,
  registerDoctor,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/registerDoctor", registerDoctor);

router.post("/login", loginUser);

router.put("/update-password", updatePassword);
router.post("/forgot-password", forgotPassword);

router.get("/:id/:role", getUserByIdAndRole);
router.put("/:id/:role", updateUserByIdAndRole);

router.put("/update-department", updateDoctorDepartment);
module.exports = router;
