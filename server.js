// ==============================
// Simple Student CRUD (One File)
// Node.js + Express + MongoDB Atlas
// ==============================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ====== Middleware ======
app.use(cors());
app.use(express.json());

// ====== Mongoose Schema & Model ======
const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleInitial: String,
  email: { type: String, required: true, unique: true },
  course: { type: String, required: true,},
  section: { type: String, required: true,},
  studentNo: { type: String, required: true, unique: true },
  year: Number
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

// ====== Routes ======

// Root
app.get('/', (req, res) => {
  res.send('✅ Student CRUD API is running!');
});

// Create a student
app.post('/api/v1/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read all students
app.get('/api/v1/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/v1/students/course/:course', async (req, res) => {
  try {
    const student = await Student.find({course:req.params.course});
    if (!student) return res.status(404).json({message: 'Student not found'});
    res.json(student);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

app.get('/api/v1/students/section/:section', async (req, res) => {
  try {
    const student = await Student.find({section:req.params.section});
    if (!student) return res.status(404).json({message: 'Student not found'});
    res.json(student);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

app.get('/api/v1/students/year/:year', async (req, res) => {
  try {
    const student = await Student.find({year:req.params.year});
    if (!student) return res.status(404).json({message: 'Student not found'});
    res.json(student);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// Read one student
app.get('/api/v1/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({message: 'Student not found'});
    res.json(student);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

app.get('/api/v1/students/email/:email', async (req, res) => {
  try {
    const student = await Student.findOne({email:req.params.email});
    if (!student) return res.status(404).json({message: 'Student not found'});
    res.json(student);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

app.get('/api/v1/students/studentNo/:studentNo', async (req, res) => {
  try {
    const student = await Student.findOne({studentNo:req.params.studentNo});
    if (!student) return res.status(404).json({message: 'Student not found'});
    res.json(student);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// Update student
app.put('/api/v1/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!student) return res.status(404).json({message: 'Student not found'});
    res.json(student);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

//Patch
app.patch('/api/v1/students/:id', async (req, res)=> {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, {$set: req.body}, {new: true, runValidators: true});
        if (!student) return res.status(404).json({message: 'Student not found'});
        res.json(student);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// Delete student
app.delete('/api/v1/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({message: 'Student not found'});
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// ====== Connect to MongoDB Atlas ======
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Failed to connect:', err.message);
  }
}

startServer();