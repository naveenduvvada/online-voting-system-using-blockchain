const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const cors = require("cors");

// Import the user model
const User = require('./models/User');

let otpStore = {};

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your preferred email service (Gmail here)
  auth: {
    user: 'vtk@gitam.in', // Your email address
    pass: 'zynr atbf wcad jipm', // Your email password (for Gmail, you may need to use an app password)
  },
});
// Initialize express app
const app = express();
app.use(cors("*"))

// Middleware to parse incoming request bodies as JSON
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// POST endpoint to create a new user
app.post('/api/users', async (req, res) => {
  const { name, email, age, gender } = req.body;
  console.log(req.body)

  // Validate incoming data
  if (!name || !email || !age || !gender) {
    return res.status(400).json({ error: 'All fields (name, email, age, gender) are required' });
  }

  try {
    // Create a new user instance
    const newUser = new User({ name, email, age, gender });

    // Save the user to the database
    const savedUser = await newUser.save();
    
    // Return the saved user as the response
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.post('/api/sendOtp', async (req, res) => {
    const { email } = req.body;
    console.log(email)
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
  
    // Store OTP in memory (you could store it in a database with an expiration time)
    otpStore[email] = otp;
  
    // Send OTP email using Nodemailer
    try {
      const info = await transporter.sendMail({
        from: 'datapro2025@gmail.com', // sender address
        to: email, // recipient address
        subject: 'Your OTP for Voting', // Subject line
        text: `Your OTP is ${otp}. It is valid for 10 minutes.`, // OTP in the body of the email
      });
  
      console.log('Email sent: ', info.response);
      return res.status(200).json({ message: 'OTP sent successfully to your email!' });
    } catch (error) {
      console.error('Error sending OTP:', error);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
  });
  

  app.post('/api/verifyOtp', (req, res) => {
    const { email, otp } = req.body;
  
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
  
    const storedOtp = otpStore[email];
  
    if (!storedOtp) {
      return res.status(400).json({ error: 'No OTP sent to this email' });
    }
  
    if (otp === storedOtp) {
      // OTP is correct, delete OTP from store to prevent reuse
      delete otpStore[email];
      return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
  });
// Define the port for the server to listen on
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
