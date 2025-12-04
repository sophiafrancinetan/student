// ==============================
// Simple Student CRUD (One File)
// Node.js + Express + MongoDB Atlas
// ==============================


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;


// ====== Middleware ======
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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
/**
 * @swagger
 * /:
 *  get:
 *    summary: API root endpoint
 *    responses: 
 *      200:
 *        description: Returns API running message
 */
app.get('/', (req, res) => {
  res.send('✅ Student CRUD API is running!');
});


// Create a student
/**
 * @swagger
 * /api/v1/students:
 *  post:
 *    summary: Add new Student
 *    tags: [Students]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Student'
 *    responses: 
 *      201:
 *        description: Student added
 *      400:
 *        description: Error Required fields are missing
 */
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
/**
 * @swagger
 * /api/v1/students:
 *  get:
 *    summary: Get all students
 *    tags: [Students]
 *    responses: 
 *      200:
 *        description: List of all the students
 */
app.get('/api/v1/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/v1/students/course/{course}:
 *   get:
 *    summary: Get all students within the course
 *    tags: [Students]
 *    parameters:
 *      - in: path
 *        name: course
 *        schema:
 *          type: string
 *        required: true
 *        description: Course code (example BSIT)
 *    responses: 
 *      200:
 *        description: List of all the students within the course
 *                
 */
app.get('/api/v1/students/course/:course', async (req, res) => {
  try {
    const student = await Student.find({course:req.params.course});
    if (!student) return res.status(404).json({message: 'Student not found'});
    res.json(student);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

/**
 * @swagger
 * /api/v1/students/section/{section}:
 *   get:
 *    summary: Get all students within the section
 *    tags: [Students]
 *    parameters:
 *      - in: path
 *        name: section
 *        schema:
 *          type: string
 *        required: true
 *    responses: 
 *      200:
 *        description: List of all the students within the section
 */
app.get('/api/v1/students/section/:section', async (req, res) => {
  try {
    const student = await Student.find({section:req.params.section});
    if (!student) return res.status(404).json({message: 'Student not found'});
    res.json(student);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

/**
 * @swagger
 * /api/v1/students/year/{year}:
 *   get:
 *    summary: Get all students within the year level
 *    tags: [Students]
 *    parameters:
 *      - in: path
 *        name: year
 *        schema:
 *          type: string
 *        required: true
 *    responses: 
 *      200:
 *        description: List of all the students within the year level
 */
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
/**
 * @swagger
 * /api/v1/students/{id}:
 *  get:
 *    summary: Get a student by ID
 *    tags: [Students]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Student found
 *      404:
 *        description: Student not found
 */
app.get('/api/v1/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({message: 'Student not found'});
    res.json(student);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

/**
 * @swagger
 * /api/v1/students/email/{email}:
 *  get:
 *    summary: Get a student by Email
 *    tags: [Students]
 *    parameters:
 *      - name: email
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Student found
 *      404:
 *        description: Student not found
 */
app.get('/api/v1/students/email/:email', async (req, res) => {
  try {
    const student = await Student.findOne({email:req.params.email});
    if (!student) return res.status(404).json({message: 'Student not found'});
    res.json(student);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

/**
 * @swagger
 * /api/v1/students/studentNo/{studentNo}:
 *  get:
 *    summary: Get a student by Student Number
 *    tags: [Students]
 *    parameters:
 *      - name: studentNo
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Student found
 *      404:
 *        description: Student not found
 */
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
/**
 * @swagger
 * /api/v1/students/{id}:
 *  put:
 *    summary: Update student (replace all required fields)
 *    tags: [Students]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema: 
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Student'
 *    responses:
 *      200:
 *        description: Student updated
 *      404:
 *        description: Student not found
 */
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
/**
 * @swagger
 * /api/v1/students/{id}:
 *  patch:
 *    summary: Partially update a student
 *    tags: [Students]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Student'
 *    responses:
 *      200:
 *        description: Student patched
 *      404:
 *        description: Student not found
 */
app.patch('/api/v1/students/:id', async (req, res)=> {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true, runValidators: true});
        if (!student) return res.status(404).json({message: 'Student not found'});
        res.json(student);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});


// Delete student
/**
 * @swagger
 * /api/v1/students/{id}:
 *  delete:
 *    summary: Delete a student
 *    tags: [Students]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses: 
 *      200:
 *        description: Student deleted
 *      404:
 *        description: Student not found
 */
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

