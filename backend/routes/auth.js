const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');
const { validate, registerSchema, loginSchema } = require('../middleware/validate');

// Initialize Google OAuth Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Security: Rate Limiter to protect against brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Max 10 requests per IP within the window
  message: { error: 'Too many attempts from this IP. Please try again after 15 minutes.' }
});

module.exports = function (prisma) {
  const router = express.Router();

  // Robust helper to locate the User model on Prisma instance
  const getUserModel = () => prisma.user || prisma.User || prisma.users;

  // =================================================================
  // 1. USER REGISTRATION (POST /api/auth/register)
  // =================================================================
  router.post('/register', authLimiter, validate(registerSchema), async (req, res) => {
    try {
      const { email, password } = req.body;

      const cleanEmail = email.trim().toLowerCase();
      const userModel = getUserModel();

      if (!userModel) {
        return res.status(500).json({ error: 'User model not found on Prisma client. Please run npx prisma generate.' });
      }

      // Check duplicate email
      const existingUser = await userModel.findUnique({
        where: { email: cleanEmail }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'An account with this email already exists.' });
      }

      // Hash password (10 salt rounds)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Store in DB
      const newUser = await userModel.create({
        data: {
          email: cleanEmail,
          password: hashedPassword
        }
      });

      console.log('✅ User registered successfully:', newUser.email);

      res.status(201).json({
        message: 'User registered successfully!',
        user: {
          id: newUser.id,
          email: newUser.email,
          createdAt: newUser.createdAt
        }
      });

    } catch (error) {
      console.error('Registration Error Detailed:', error);
      res.status(500).json({ error: error.message || 'Failed to register user.' });
    }
  });

  // =================================================================
  // 2. USER LOGIN (POST /api/auth/login)
  // =================================================================
  router.post('/login', authLimiter, validate(loginSchema), async (req, res) => {
    try {
      const { email, password } = req.body;

      const cleanEmail = email.trim().toLowerCase();
      const userModel = getUserModel();

      if (!userModel) {
        return res.status(500).json({ error: 'User model not found on Prisma client.' });
      }

      // Find user
      const user = await userModel.findUnique({
        where: { email: cleanEmail }
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // Compare bcrypt hash
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // Sign JWT Token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
      );

      console.log('✅ User logged in:', user.email);

      res.json({
        message: 'Login successful!',
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });

    } catch (error) {
      console.error('Login Error Detailed:', error);
      res.status(500).json({ error: error.message || 'Failed to log in.' });
    }
  });

  // =================================================================
  // 3. GOOGLE OAUTH LOGIN (POST /api/auth/google)
  // =================================================================
  router.post('/google', authLimiter, async (req, res) => {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({ error: 'Google ID Token is required.' });
      }

      const userModel = getUserModel();
      if (!userModel) {
        return res.status(500).json({ error: 'User model not found on Prisma client.' });
      }

      // Verify token with Google API
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      const cleanEmail = payload.email.toLowerCase();

      // Check if user already exists or create new account
      let user = await userModel.findUnique({
        where: { email: cleanEmail }
      });

      if (!user) {
        const dummyPassword = await bcrypt.hash(Math.random().toString(36), 10);
        user = await userModel.create({
          data: {
            email: cleanEmail,
            password: dummyPassword
          }
        });
        console.log('✅ Created new account via Google OAuth:', user.email);
      }

      // Generate app JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
      );

      console.log('✅ Google OAuth authenticated:', user.email);

      res.json({
        message: 'Google Sign-In successful!',
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });

    } catch (error) {
      console.error('Google OAuth Error:', error);
      res.status(401).json({ error: 'Failed to verify Google ID token.' });
    }
  });

  return router;
};