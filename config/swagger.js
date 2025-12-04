const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Student CRUD API',
    version: '1.0.0',
    description: 'API documentation for Student CRUD using Express + MongoDB.',
  },
  servers: [
    {
      url: 'https://studentinformationapi.onrender.com/api-docs/#/',
      description: 'Swagger Server',
    },
  ],
  components: {
    schemas: {
      Student: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'course', 'section', 'studentNo'],
        properties: {
          firstName: { type: 'string', example: 'Juan' },
          lastName: { type: 'string', example: 'Dela Cruz' },
          middleInitial: { type: 'string', example: 'A' },
          email: { type: 'string', example: 'juan@example.com' },
          course: { type: 'string', example: 'BSIT' },
          section: { type: 'string', example: '3BSIT-4' },
          studentNo: { type: 'string', example: '123-456-789' },
          year: { type: 'integer', example: 2 },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [path.join(__dirname, '../server.js')], // Swagger will scan server.js for route docs
};

module.exports = swaggerJSDoc(options);
