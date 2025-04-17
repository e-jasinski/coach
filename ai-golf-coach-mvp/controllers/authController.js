const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sg = require('@sendgrid/mail');
const { User } = require('../models');
require('dotenv').config();

// Set SendGrid API key
sg.setApiKey(process.env.SENDGRID_API_KEY);

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already taken.' });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await User.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });

    res.status(201).json({ message: 'User registered.', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate a JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login successful.',
      token,
      userId: user.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Processing password reset request for email:', email);
    
    const user = await User.findOne({ where: { email } });
    console.log('User found:', !!user);

    if (user) {
      const token = crypto.randomUUID();
      const expires = new Date(Date.now() + +process.env.RESET_TOKEN_EXP_MIN * 60000);
      await user.update({ resetToken: token, resetExpires: expires });
      console.log('Reset token generated and stored:', { token, expires });

      const resetLink = `${process.env.FRONTEND_BASE_URL}/reset?token=${token}`;
      console.log('Reset link generated:', resetLink);

      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@aigolfcoach.com',
        subject: 'Reset your AI Golf Coach password',
        text: `Click here to reset: ${resetLink}`,
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
      };

      console.log('Attempting to send email with config:', {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@aigolfcoach.com',
        apiKeyExists: !!process.env.SENDGRID_API_KEY,
        frontendBaseUrl: process.env.FRONTEND_BASE_URL
      });

      try {
        await sg.send(msg);
        console.log('Reset email sent successfully');
      } catch (emailError) {
        console.error('SendGrid Error:', {
          message: emailError.message,
          response: emailError.response ? emailError.response.body : 'No response body',
          code: emailError.code,
          stack: emailError.stack
        });
        // Still return 200 to avoid email enumeration
      }
    }
    // Always 200 to avoid email enumeration
    res.json({ message: 'If that email is registered, a reset link is on its way.' });
  } catch (err) {
    console.error('Server error in forgotPassword:', {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ where: { resetToken: token } });
    if (!user || !user.resetExpires || user.resetExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    const hash = await bcrypt.hash(password, 10);
    await user.update({ passwordHash: hash, resetToken: null, resetExpires: null });

    res.json({ message: 'Password updated. You can now log in.' });
  } catch (err) {
    console.error('Server error in resetPassword:', {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'createdAt'], // Exclude sensitive data
    });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getAllUsers,
};
