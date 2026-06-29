const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. MIDDLEWARE CONFIGURATION
// ==========================================
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Connects cleanly to your Vite frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ==========================================
// 2. IN-MEMORY DATA STORE (Agricultural Diagnostic Logs)
// ==========================================
let diagnosticLogs = [
  { id: '1', cropType: 'Wheat', issueCategory: 'Pest', description: 'Yellowing leaves with small brown rust spots.', status: 'resolved', severity: 'medium' },
  { id: '2', cropType: 'Rice', issueCategory: 'Nutrient', description: 'Stunted growth and pale green leaves from suspected nitrogen deficiency.', status: 'pending', severity: 'high' },
  { id: '3', cropType: 'Apple', issueCategory: 'Disease', description: 'Dark scab-like lesions forming on mature fruit skins.', status: 'resolved', severity: 'high' },
  { id: '4', cropType: 'Tomato', issueCategory: 'Pest', description: 'Whitefly cluster observations on lower leaf layers.', status: 'active', severity: 'low' }
];

// ==========================================
// 3. REST API ENDPOINTS (6 REQUIRED PIPELINES)
// ==========================================

// Endpoint A [GET]: List all diagnostic records
app.get('/api/diagnostics', (req, res, next) => {
  try {
    res.status(200).json(diagnosticLogs);
  } catch (error) {
    next(error);
  }
});

// Endpoint B [GET]: Search / Filter records by status (Analytical Endpoint)
app.get('/api/diagnostics/search', (req, res, next) => {
  try {
    const { status } = req.query;
    if (!status) {
      return res.status(400).json({ error: 'Query parameter "status" is mandatory.' });
    }
    const filteredLogs = diagnosticLogs.filter(log => log.status.toLowerCase() === status.toLowerCase());
    res.status(200).json(filteredLogs);
  } catch (error) {
    next(error);
  }
});

// Endpoint C [GET]: Fetch an individual diagnostic log by ID
app.get('/api/diagnostics/:id', (req, res, next) => {
  try {
    const log = diagnosticLogs.find(l => l.id === req.params.id);
    if (!log) {
      return res.status(404).json({ error: `Diagnostic log entry with ID ${req.params.id} not found.` });
    }
    res.status(200).json(log);
  } catch (error) {
    next(error);
  }
});

// Endpoint D [POST]: Create a new farmer diagnostic ticket (AI entry simulation)
app.post('/api/diagnostics', (req, res, next) => {
  try {
    const { cropType, issueCategory, description, severity } = req.body;
    
    if (!cropType || !issueCategory || !description || !severity) {
      return res.status(400).json({ error: 'Validation Failure: cropType, issueCategory, description, and severity fields are mandatory.' });
    }

    const newLog = {
      id: String(diagnosticLogs.length + 1),
      cropType,
      issueCategory,
      description,
      status: 'active',
      severity
    };

    diagnosticLogs.push(newLog);
    res.status(201).json(newLog);
  } catch (error) {
    next(error);
  }
});

// Endpoint E [PUT]: Update a diagnostic status or severity parameters
app.put('/api/diagnostics/:id', (req, res, next) => {
  try {
    const index = diagnosticLogs.findIndex(l => l.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: `Modification rejected: Log ID ${req.params.id} not found.` });
    }

    const updatedLog = { ...diagnosticLogs[index], ...req.body, id: req.params.id };
    diagnosticLogs[index] = updatedLog;
    
    res.status(200).json(updatedLog);
  } catch (error) {
    next(error);
  }
});

// Endpoint F [DELETE]: Erase a diagnostic record from memory
app.delete('/api/diagnostics/:id', (req, res, next) => {
  try {
    const index = diagnosticLogs.findIndex(l => l.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: `Deletion target mismatch: Log ID ${req.params.id} does not exist.` });
    }

    diagnosticLogs = diagnosticLogs.filter(l => l.id !== req.params.id);
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 4. GLOBAL ERROR-HANDLING MIDDLEWARE
// ==========================================
app.use((err, req, res, next) => {
  console.error('System Exception Trapped:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Initialize Listener Loop
app.listen(PORT, () => {
  console.log(`📡 Agri-Allied AI Backend active on operational port structure: http://localhost:${PORT}`);
});