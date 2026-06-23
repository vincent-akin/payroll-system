// backend/src/config/swagger.js
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Payroll Management System API',
    version: '1.0.0',
    description: 'Complete REST API for managing payroll, employees, departments, leaves, and deductions.',
    contact: { name: 'API Support', email: 'support@payrollsystem.com' },
  },
  servers: [
    { url: 'http://localhost:5000/api/v1', description: 'Development Server' },
    { url: 'https://api.payrollsystem.com/api/v1', description: 'Production Server' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['admin', 'staff', 'user'] },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Employee: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          employeeId: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          department: { type: 'string' },
          position: { type: 'string' },
          employmentType: { type: 'string', enum: ['full-time', 'part-time', 'contract'] },
          salary: { type: 'number' },
          startDate: { type: 'string', format: 'date' },
          status: { type: 'string', enum: ['active', 'inactive', 'terminated'] },
        },
      },
      Department: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          code: { type: 'string' },
          manager: { type: 'string' },
          description: { type: 'string' },
          budget: { type: 'number' },
        },
      },
      Payroll: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          employee: { type: 'string' },
          period: { type: 'string' },
          basicSalary: { type: 'number' },
          allowances: { type: 'number' },
          grossPay: { type: 'number' },
          totalDeductions: { type: 'number' },
          netPay: { type: 'number' },
          status: { type: 'string', enum: ['draft', 'pending', 'approved', 'paid', 'rejected'] },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errors: { type: 'array', items: { type: 'object' } },
        },
      },
      Success: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', example: 'john@example.com' },
                  password: { type: 'string', example: 'Password123!' },
                  role: { type: 'string', enum: ['admin', 'staff', 'user'], example: 'user' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Validation error' },
          409: { description: 'Email already exists' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@payroll.com' },
                  password: { type: 'string', example: 'Admin123!' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful with JWT token' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current authenticated user',
        responses: {
          200: { description: 'Current user data' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout user',
        responses: { 200: { description: 'Logged out successfully' } },
      },
    },
    '/employees': {
      get: {
        tags: ['Employees'],
        summary: 'Get all employees',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'department', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'List of employees' } },
      },
      post: {
        tags: ['Employees'],
        summary: 'Create a new employee',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Employee' },
            },
          },
        },
        responses: {
          201: { description: 'Employee created' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/employees/{id}': {
      get: {
        tags: ['Employees'],
        summary: 'Get employee by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Employee data' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Employees'],
        summary: 'Update employee',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Employees'],
        summary: 'Delete employee',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },
    '/departments': {
      get: { tags: ['Departments'], summary: 'Get all departments', responses: { 200: { description: 'List' } } },
      post: { tags: ['Departments'], summary: 'Create department', responses: { 201: { description: 'Created' } } },
    },
    '/payroll': {
      get: { tags: ['Payroll'], summary: 'Get all payroll records', responses: { 200: { description: 'List' } } },
      post: { tags: ['Payroll'], summary: 'Create payroll record', responses: { 201: { description: 'Created' } } },
    },
    '/payroll/{id}/approve': {
      patch: {
        tags: ['Payroll'],
        summary: 'Approve payroll (Admin only)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Approved' }, 403: { description: 'Forbidden' } },
      },
    },
    '/payroll/{id}/process': {
      patch: {
        tags: ['Payroll'],
        summary: 'Process/mark payroll as paid',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Processed' } },
      },
    },
    '/leaves': {
      get: { tags: ['Leave Management'], summary: 'Get leave requests', responses: { 200: { description: 'List' } } },
      post: { tags: ['Leave Management'], summary: 'Submit leave request', responses: { 201: { description: 'Submitted' } } },
    },
    '/leaves/{id}/approve': {
      patch: {
        tags: ['Leave Management'],
        summary: 'Approve leave request',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Approved' } },
      },
    },
    '/deductions': {
      get: { tags: ['Deductions'], summary: 'Get deduction types', responses: { 200: { description: 'List' } } },
      post: { tags: ['Deductions'], summary: 'Create deduction type', responses: { 201: { description: 'Created' } } },
    },
  },
};

export default swaggerDocument;