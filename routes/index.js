// here we will create our index or main router 
// import express 
const express = require('express');
// using express to create the router 
// we will need to import our movie database model here 
const Movie = require('../models/movie');
const { supported } = require('filepond');
const router = express.Router();
// we export the router now for usage in the server

// main / index route that renders our index or home page
router.get('/', async (req, res) => {
    let movies;
    try{
        // we get our books from the database and store them in the variable we declared
        // we sort our movies according to the number of seasons that they have and in descending order 
        movies = await Movie.find().sort({seasons: 'desc'}).limit(10).exec();
    }catch{
        movies = []; // we render an empty array 
    }
    // we render our homepage here 
    res.render('index', {movies: movies});
});
module.exports = router;