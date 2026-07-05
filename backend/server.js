// =================================================================
// 1. INITIALIZE ENVIRONMENT VARIABLES (Must run at the absolute top)
// =================================================================
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

// Note: If your schema uses the default Prisma 7 output, it will be here.
// If you get an import error on this line, change it to: require('@prisma/client')
const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = process.env.PORT || 5000;

// =================================================================
// 2. PRISMA 7 DRIVER ADAPTER INITIALIZATION
// =================================================================
// Create the MariaDB/MySQL connection configuration using your Aiven cloud URL
const adapter = new PrismaMariaDb({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

// =================================================================
// 3. MIDDLEWARE INSTANCES
// =================================================================
app.use(cors());
app.use(express.json());

// =================================================================
// 4. API ROUTE ENDPOINTS (CRUD API Logic)
// =================================================================

// READ ALL MODULES
app.get('/api/diagnostic-modules', async (req, res) => {
  try {
    const modules = await prisma.diagnostic_modules.findMany();
    res.json(modules);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch diagnostic records.' });
  }
});

// CREATE NEW MODULE
app.post('/api/diagnostic-modules', async (req, res) => {
  try {
    const { cropType, issueCategory, severity, status, description } = req.body;
    const newModule = await prisma.diagnostic_modules.create({
      data: { cropType, issueCategory, severity, status, description }
    });
    res.status(201).json(newModule);
  } catch (error) {
    console.error('Create Error:', error);
    res.status(500).json({ error: 'Failed to create record.' });
  }
});

// UPDATE MODULE
app.put('/api/diagnostic-modules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cropType, issueCategory, severity, status, description } = req.body;
    const updatedModule = await prisma.diagnostic_modules.update({
      where: { id: parseInt(id) },
      data: { cropType, issueCategory, severity, status, description }
    });
    res.json(updatedModule);
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ error: 'Failed to update record.' });
  }
});

// DELETE MODULE
app.delete('/api/diagnostic-modules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.diagnostic_modules.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Record successfully deleted.' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete record.' });
  }
});

// =================================================================
// 5. SERVER RUN CHECK
// =================================================================
app.listen(PORT, () => {
  console.log(`🚀 Unified API Engine listening on http://localhost:${PORT}`);
});