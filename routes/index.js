// here we will create our index or main router 
// import express 
const express = require('express');
// using express to create the router 
const router = express.Router();
// we export the router now for usage in the server

// main / index route that renders our index or home page
router.get('/', (req, res) => {
    // we render our homepage here 
    res.render('index');
});
module.exports = router;