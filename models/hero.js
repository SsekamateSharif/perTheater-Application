// here we will create our hero database model
// we will use mongoose to create our hero database model
// we import mongoose
const mongoose = require('mongoose');
// we use mongoose to create our hero schema
const heroSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

// we export our database model for usage in our router
module.exports = mongoose.model('Hero', heroSchema);