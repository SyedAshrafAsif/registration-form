const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/user_registration', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  role: String,
  name: String,
  gender: String,
  dob: Date,
  nationalId: String,
  email: String,
  phoneNumber: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
  try {
    const userData = req.body;
    const newUser = new User(userData);
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
