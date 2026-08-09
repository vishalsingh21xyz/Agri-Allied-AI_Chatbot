// =================================================================
// 1. ALLOW AIVEN SELF-SIGNED SSL & INITIALIZE ENV
// =================================================================
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

// Imports for Auth, AI, and Middleware
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const verifyToken = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// =================================================================
// 2. PARSE AIVEN URL & INITIALIZE PRISMA ADAPTER
// =================================================================
const dbUrl = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace('/', '') || 'defaultdb',
  ssl: {
    rejectUnauthorized: false
  },
  connectionLimit: 10
});

// Single instance declaration of PrismaClient
const prisma = new PrismaClient({ adapter });

// Safe getter for model casing
const getModel = () => prisma.diagnosticModule || prisma.diagnostic_modules;

// Startup connection test
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Connected securely to Aiven Cloud Database.');
  } catch (error) {
    console.error('❌ Database connection failure:', error);
  }
}
testConnection();

// =================================================================
// 3. MIDDLEWARE & ROUTER MOUNTS
// =================================================================

// Dynamic CORS Configuration supporting Localhost and Live Vercel Production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL // Populated dynamically from Render dashboard
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Allow fallback during initial deployment testing
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[API LOG] ${req.method} ${req.url}`);
  next();
});

// Mount Auth Routes passing the single prisma instance
app.use('/api/auth', authRoutes(prisma));

// Mount Week 7 AI Routes
app.use('/api/ai', aiRoutes);

// =================================================================
// 4. DIAGNOSTIC MODULES API ENDPOINTS
// =================================================================

// READ ALL (Public access)
app.get('/api/diagnostic-modules', async (req, res) => {
  try {
    const records = await getModel().findMany();
    res.json(records);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch records.' });
  }
});

// CREATE (PROTECTED by verifyToken)
app.post('/api/diagnostic-modules', verifyToken, async (req, res) => {
  try {
    const { cropType, issueCategory, severity, status, description } = req.body;

    if (!cropType || !issueCategory) {
      return res.status(400).json({ error: 'Crop Type and Issue Category are required.' });
    }

    const newModule = await getModel().create({
      data: {
        cropType,
        issueCategory,
        severity: severity || 'Medium',
        status: status || 'Pending',
        description: description || ''
      }
    });
    console.log('✅ Created by authenticated user:', req.user.email);
    res.status(201).json(newModule);
  } catch (error) {
    console.error('Create Error:', error);
    res.status(500).json({ error: error.message || 'Failed to create record.' });
  }
});

// UPDATE (PROTECTED by verifyToken)
app.put('/api/diagnostic-modules/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { cropType, issueCategory, severity, status, description } = req.body;
    const updatedModule = await getModel().update({
      where: { id: parseInt(id) },
      data: { cropType, issueCategory, severity, status, description }
    });
    res.json(updatedModule);
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ error: error.message || 'Failed to update record.' });
  }
});

// DELETE (PROTECTED by verifyToken)
app.delete('/api/diagnostic-modules/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await getModel().delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Record successfully deleted.' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete record.' });
  }
});

// =================================================================
// 5. SERVER RUN
// =================================================================
app.listen(PORT, () => {
  console.log(`🚀 Unified API Engine listening on http://localhost:${PORT}`);
});