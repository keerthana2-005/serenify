require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8081;

// ==============================
//  Middleware
// ==============================

// ✅ DIAGNOSTIC LOGGER ADDED
// This will show every single request that hits the server, right as it arrives.
app.use((req, res, next) => {
  console.log(`-->> INCOMING REQUEST: ${req.method} ${req.originalUrl}`);
  next();
});

// Use the default, wide-open CORS configuration for debugging.
app.use(cors());

// Body Parsing Middleware: To parse incoming JSON payloads.
app.use(express.json());

// Original simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ==============================
// PostgreSQL Connection
// ==============================
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('✅ Connected to database');
  release(); // Release the client back to the pool
});

// Create tables if they don't exist
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS temp_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        otp VARCHAR(10) NOT NULL,
        otp_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('✅ Ensured required tables exist');
  } catch (schemaErr) {
    console.error('Schema initialization error:', schemaErr);
  }
})();

// ==============================
// Nodemailer Setup
// ==============================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // For Gmail, use an "App Password"
  },
});

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ==============================
// 1️⃣ Signup Route
// =-============================
app.post('/api/signup', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const userExists = await pool.query(
      'SELECT * FROM users WHERE username=$1 OR email=$2',
      [username, email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'Email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await pool.query(
      `INSERT INTO temp_users (username, email, password_hash, otp, otp_expires_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET
         username = EXCLUDED.username,
         password_hash = EXCLUDED.password_hash,
         otp = EXCLUDED.otp,
         otp_expires_at = EXCLUDED.otp_expires_at`,
      [username, email, hashedPassword, otp, otpExpiresAt]
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Serenify.co Signup',
      text: `Hello ${username},\n\nYour OTP is: ${otp}\nThis code will expire in 10 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${email}`);
    } catch (mailErr) {
      console.error('Email sending failed:', mailErr.message);
      if (!IS_PRODUCTION) {
        console.log(`DEV MODE: OTP for ${email} is ${otp}`);
      } else {
        throw mailErr;
      }
    }
    res.status(200).json({ message: 'OTP sent to your email successfully!' });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup process' });
  }
});

// ==============================
// 2️⃣ Verify OTP Route
// ==============================
app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM temp_users WHERE email=$1', [email]);
    const tempUser = result.rows[0];

    if (!tempUser) {
      return res.status(404).json({ message: 'No pending verification for this email. Please sign up again.' });
    }
    if (new Date() > new Date(tempUser.otp_expires_at)) {
      return res.status(400).json({ message: 'OTP has expired. Please try signing up again.' });
    }
    if (tempUser.otp !== otp) {
      return res.status(400).json({ message: 'The OTP entered is incorrect.' });
    }

    await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [tempUser.username, tempUser.email, tempUser.password_hash]
    );

    await pool.query('DELETE FROM temp_users WHERE email=$1', [email]);

    res.status(201).json({ message: 'Account verified successfully! You can now log in.' });
  } catch (err) {
    console.error('Verification error:', err);
    if (err.code === '23505') {
        return res.status(409).json({ message: 'This user has already been verified.' });
    }
    res.status(500).json({ message: 'Server error during verification' });
  }
});

// ==============================
// 3️⃣ Resend OTP Route
// ==============================
app.post('/api/resend-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const result = await pool.query('SELECT * FROM temp_users WHERE email=$1', [email]);
    const tempUser = result.rows[0];

    if (!tempUser) {
      return res.status(404).json({ message: 'No pending verification for this email. Please sign up again.' });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      'UPDATE temp_users SET otp=$1, otp_expires_at=$2 WHERE email=$3',
      [newOtp, newExpiry, email]
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your new OTP for Serenify.co Signup',
      text: `Your new OTP is: ${newOtp}. It expires in 10 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Resent OTP to ${email}`);
    } catch (mailErr) {
      console.error('Resend email failed:', mailErr.message);
      if (!IS_PRODUCTION) {
        console.log(`DEV MODE: Resent OTP for ${email} is ${newOtp}`);
      } else {
        throw mailErr;
      }
    }
    res.status(200).json({ message: 'A new OTP has been sent to your email.' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: 'Server error while resending OTP' });
  }
});

// ==============================
// 4️⃣ Login Route
// ==============================
app.post('/api/login', async (req, res) => {
  const { email, username, identifier, password } = req.body;
  const loginId = identifier || email || username;
  if (!loginId || !password) {
    return res.status(400).json({ message: 'Email/username and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1 OR username=$1', [loginId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ==============================
// Start Server
// ==============================
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));