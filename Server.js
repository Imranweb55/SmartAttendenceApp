require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

const MONGO_URI = "mongodb://localhost:27017/Myproject";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ========== SCHEMAS ==========
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

const TeacherSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  classDept: String,
  sectionSemester: String,
  email: String,
  phoneNo: String,
  schoolCollege: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const Teacher = mongoose.model("Teacher", TeacherSchema);

const StudentSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  rollNo: String,
  phoneNo: String,
  parentPhoneNo: String,
  picture: String,
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
});
const Student = mongoose.model("Student", StudentSchema);

// ========== MIDDLEWARE ==========
const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ message: "Access Denied" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

// ========== ROUTES ==========

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "24h" }
    );

    const teacher = await Teacher.findOne({ userId: user._id });

    res.json({
      message: "Login successful",
      token,
      teacherId: teacher ? teacher._id : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ CREATE TEACHER
app.post("/teacher", authenticate, async (req, res) => {
  try {
    const teacherData = {
      ...req.body,
      userId: req.user.id,
    };

    const newTeacher = new Teacher(teacherData);
    await newTeacher.save();

    res.json({
      message: "Teacher details saved successfully",
      teacherId: newTeacher._id,
    });
  } catch (error) {
    console.error("❌ Error saving teacher:", error);
    res.status(500).json({ message: "Error saving teacher details", error });
  }
});

// ✅ UPDATE TEACHER
app.put("/teacher", authenticate, async (req, res) => {
  try {
    const updated = await Teacher.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({
      message: "Teacher details updated successfully",
      teacherId: updated._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update teacher", error });
  }
});

// ✅ GET TEACHER DETAILS
app.get("/teacher", authenticate, async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Not found" });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teacher", error });
  }
});

// ✅ SAVE STUDENTS
app.post("/students", authenticate, async (req, res) => {
  try {
    const { teacherId, students } = req.body;

    if (!teacherId) {
      return res.status(400).json({ message: "teacherId is required" });
    }

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "No students data provided" });
    }

    const studentsWithTeacher = students.map((student) => ({
      ...student,
      teacherId,
    }));

    await Student.insertMany(studentsWithTeacher);
    res.json({ message: "Students saved successfully" });
  } catch (error) {
    console.error("Error saving students:", error);
    res.status(500).json({ message: "Error saving students", error });
  }
});

// ✅ UPDATE STUDENTS
app.put("/students", authenticate, async (req, res) => {
  try {
    const { teacherId, students } = req.body;

    if (!teacherId || !students) {
      return res.status(400).json({ message: "Missing required data" });
    }

    await Student.deleteMany({ teacherId });
    const newData = students.map((s) => ({ ...s, teacherId }));
    await Student.insertMany(newData);

    res.json({ message: "Students updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update students", error });
  }
});

// ✅ SEND SMS TO ABSENTEES' PARENTS
app.post("/send-sms", async (req, res) => {
  const { absentees } = req.body;
  const FAST2SMS_API_KEY =
    "HAhRl3ZmVn1b9Q7qKsvUdDeYt5OTEFwPByoW2uagLIS6zGMpCJX613lsEMKv7mUPoNdz8k4Fc0i9ywrT";

  if (!FAST2SMS_API_KEY) {
    return res.status(500).json({ error: "FAST2SMS_API_KEY not configured" });
  }

  try {
    for (const student of absentees) {
      if (!student.parentPhoneNo) continue;

      const message = `Dear Parent, your child ${student.name} (${student.rollNo}) is absent today. Please contact the class teacher.`;

      await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {},
        {
          headers: {
            authorization: FAST2SMS_API_KEY,
          },
          params: {
            route: "v3",
            sender_id: "TXTIND",
            message,
            language: "english",
            flash: 0,
            numbers: student.parentPhoneNo,
          },
        }
      );

      console.log("📤 SMS sent to:", student.parentPhoneNo);
    }

    res.json({ message: "All SMS sent" });
  } catch (error) {
    console.error("❌ SMS Error:", error.message);
    res.status(500).json({ error: "Failed to send SMS" });
  }
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
