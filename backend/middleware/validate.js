const { z } = require('zod');

// 1. Auth Schemas
const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address format.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' })
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address format.' }),
  password: z.string().min(1, { message: 'Password is required.' })
});

// 2. Diagnostic Module Schema
const diagnosticModuleSchema = z.object({
  cropType: z.string().min(2, { message: 'Crop type must be at least 2 characters.' }),
  issueCategory: z.string().min(2, { message: 'Issue category must be at least 2 characters.' }),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  status: z.enum(['Pending', 'Under Review', 'Resolved']).optional(),
  description: z.string().optional()
});

// Middleware generator
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issue = error.issues[0];
      return res.status(400).json({ error: issue.message });
    }
    return res.status(400).json({ error: 'Invalid input data.' });
  }
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  diagnosticModuleSchema
};