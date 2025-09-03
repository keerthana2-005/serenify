require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
    return;
  }
  console.log('Connected to database');
  release();
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ===============================================
// ## 1. SIGNUP ENDPOINT ##
// ===============================================
app.post('/api/signup', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if user already exists in the permanent table
    const userExists = await pool.query(
      'SELECT * FROM users WHERE username=$1 OR email=$2',
      [username, email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Use INSERT ... ON CONFLICT to update OTP if user tries to sign up again before verifying
    await pool.query(
      `INSERT INTO temp_users (username, email, password_hash, otp, otp_expires_at) 
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET
       otp = EXCLUDED.otp,
       otp_expires_at = EXCLUDED.otp_expires_at`,
      [username, email, hashedPassword, otp, otpExpiresAt]
    );

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Serenify.co Signup',
      text: `Hello ${username},\n\nYour One-Time Password (OTP) is: ${otp}\nIt will expire in 10 minutes.\n\nThank you!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: "Error sending OTP email" });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: "OTP sent to your email" });
      }
    });

  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// ===============================================
// ## 2. VERIFY OTP ENDPOINT (NEW) ##
// ===============================================
app.post('/api/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
        // Find the temporary user
        const result = await pool.query('SELECT * FROM temp_users WHERE email = $1', [email]);
        const tempUser = result.rows[0];

        if (!tempUser) {
            return res.status(400).json({ message: "Invalid request. Please sign up again." });
        }

        // Check if OTP has expired
        if (new Date() > new Date(tempUser.otp_expires_at)) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        // Check if OTP is correct
        if (tempUser.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        // If OTP is valid, move user to the permanent 'users' table
        await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
            [tempUser.username, tempUser.email, tempUser.password_hash]
        );

        // Delete the temporary user record
        await pool.query('DELETE FROM temp_users WHERE email = $1', [email]);
        
        res.status(201).json({ message: "Account verified successfully! You can now log in." });

    } catch (err) {
        console.error('Verification Error:', err);
        res.status(500).json({ message: "Server error during verification" });
    }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});