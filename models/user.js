// models/user.js
const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
  image: String,
  email: String,
  name: String,
});

// Create and export the model
module.exports = mongoose.model('User', userSchema);
