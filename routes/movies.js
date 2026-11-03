// here we wil create our movies router and routes 
// import express
const express = require('express');
// import our movies model
const Movie = require('../models/movie');
const Hero = require('../models/hero')
// use express to create our router 
const router = express.Router();
// we create our array for acceptable image types for uploads 
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']; // these are the acceptable image types for uploads 

// we will create our routes here 

// getting all movies
router.get('/', async (req, res)=>{
    try{
        // we try to add search conditions for each parameter and dictates which movie is retrieved from the database according to the information input by the user
        // we have to create search conditions for different properties of our movies in our database search and retrieval
        // we have to first get our movies from our database and store them in a variable
        let query = Movie.find();

        // then we create search conditions for our properties 
        // title search condition 
        // since its a GET request we use req.query since we will be sending instructions to retrieve existing data from the database 
        if(req.query.title != null && req.query.title != ''){
            // we check wether the user entered a title
            query = query.regex('title', new RegExp(req.query.title, 'i')); // we add a regular expression to our movie title so that we can easily search for it with even single characters
        }
        // we create a search condition for our published after date 
        if(req.query.publishAfter != null && req.query.publishAfter != ''){
            // we check if the user has entered a published after date 
            query = query.gte('publishDate', req.query.publishAfter);
        }
        // we create search conditions for the publish before date 
        // we check if the user input the public before date
        if(req.query.publishBefore != null && req.query.publishBefore != ''){
            // then we add our search condition where by it has to be less or equal to the publish date of the movie
            query = query.lte('publishDate', req.query.publishBefore);
        }

        // then after we execute all our search condition parameters 
        const movies = await query.exec();

        // then we render the movies index page 
        res.render('movies/index', {
            movies: movies,
            searchOptions: req.query // these will determine our search conditions 
        })
    }catch{
        res.redirect('/');
    }
});

// new movie
router.get('/new', async (req, res)=> {
    try{
        const heros = await Hero.find({}); // we find the heros from the database 
        const movie = new Movie(); // we create a new movie object that we will populate using our new movie page form
        res.render('movies/new', {
            heros: heros, // we name this according to the variable name that we used while iterating our heros in our form fields ejs code
            movie: movie
        }); // we render our new movie page passing in our hero and movie objects 
    }catch{
        res.redirect('/movies');
    }
});

// creating movies 
router.post('/', async (req, res) => {
    // we need to create a movie object that we will save in our database 
    const movie = new Movie({
        title: req.body.title,
        hero: req.body.hero,
        publishDate: req.body.publishDate,
        seasons: req.body.seasons,
        description: req.body.description,
        createdAt: req.body.createdAt
    });
    // now we have to save our uploaded movie cover 
    saveCover(movie, req.body.cover);
    // now we save our created onto our database 
    try{
        const newMovie = await movie.save();
        // we render the movie show page 
        //res.render(`movies/${newMovie.id}`);
        res.redirect('/movies'); // this is for now 
    }catch{
        // if there is an error we render our new movies page with an error message as well
        res.render('movies/new', {
            movie: movie,
            errorMessage: "Error Creating Movie"
        }); 
    }
});

// we create a function that saves our uploaded images into the mongoose database of our application 
// movie parameter is the movie we are creating or updating 
// coverEncoded: is the cover image details for the image being uploaded
function saveCover(movie, coverEncoded){
    // we have to first check and see if there is any images uploaded 
    if(coverEncoded == null){
        return; 
    }
    // if there is an image uploaded we convert its details from a json file into a javascript object 
    const cover = JSON.parse(coverEncoded);
    // we need to convert its data into a node.js buffer that can allow us to store the image into our database 
    // we check and see if the cover image is uploaded and it is of the right image type acceptable
    if(cover != null && imageMimeTypes.includes(cover.type)){
        // since its now a javascript object we can easily access its properties such as the image type property 
        // we convert the image data from base64 string to a node.js buffer for storage in our database 
        movie.coverImage =  new Buffer.from(cover.data, 'base64');
        movie.coverImageType = cover.type; 
    }
}


// we export the router   
module.exports = router;