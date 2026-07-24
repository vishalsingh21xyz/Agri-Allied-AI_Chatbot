// =================================================================
// 1. ALLOW AIVEN SELF-SIGNED SSL CERTIFICATES (Must run FIRST)
// =================================================================
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const app = express();
const PORT = process.env.PORT || 5000;

// =================================================================
// 2. PARSE AIVEN URL & INITIALIZE ADAPTER
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

const prisma = new PrismaClient({ adapter });

// Safe getter for model casing
const getModel = () => prisma.diagnosticModule || prisma.diagnostic_modules;

// Startup connection check
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
// 3. MIDDLEWARE
// =================================================================
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[API LOG] ${req.method} ${req.url}`);
  next();
});

// =================================================================
// 4. API ENDPOINTS
// =================================================================

// READ ALL
app.get('/api/diagnostic-modules', async (req, res) => {
  try {
    const records = await getModel().findMany();
    res.json(records);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch records.' });
  }
});

// CREATE
app.post('/api/diagnostic-modules', async (req, res) => {
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
    console.log('✅ Created in Cloud DB:', newModule.id);
    res.status(201).json(newModule);
  } catch (error) {
    console.error('Create Error:', error);
    res.status(500).json({ error: error.message || 'Failed to create record.' });
  }
});

// UPDATE
app.put('/api/diagnostic-modules/:id', async (req, res) => {
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

// DELETE
app.delete('/api/diagnostic-modules/:id', async (req, res) => {
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