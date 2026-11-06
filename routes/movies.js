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
        res.render(`movies/${newMovie.id}`);
    }catch{
        const heros = await Hero.find({});
        // if there is an error we render our new movies page with an error message as well
        res.render('movies/new', {
            movie: movie,
            heros: heros,
            errorMessage: "Error Creating Movie"
        }); 
    }
});


// we add the show route, edit route, update route, delete route 
// show movie route 
router.get('/:id', async (req, res)=>{
    // we render our show page for our movies 
    try{
        const movie = await Movie.findById(req.params.id).populate('hero').exec(); // we find the movie from the database by their id 
        // we replace the referenced hero object id with the real author 
        // we then render our show page 
        res.render('movies/show', {
            movie: movie
        })
    }catch{
        res.redirect('/movies');
    }
});

// editing movie route
router.get('/:id/edit', async (req, res)=>{
    // we render our edit page 
    try{
        // we get our movie from the database by their id  
        const movie = await Movie.findById(req.params.id);
        // we get our hero associated to our movie
        const heros = await Hero.find({});
        // then we render our edit page with our movie that we retrieved 
        res.render('movies/edit', {
            heros: heros,
            movie: movie
        });
    }catch{
        res.redirect('/movies'); // redirect to the movies home / index page 
    }
});

// updating movie route
router.put('/:id', async (req, res)=>{
    // we give our edit page its functionality 
    // we create a variable for storing our movie 
    let movie;
    try{
        // we get our movie from the database 
        movie = await Movie.findById(req.params.id);
        // changing or updating the parameters that the user updates 
        movie.title = req.body.title;
        movie.hero = req.body.hero;
        movie.publishDate = req.body.publishDate;
        movie.seasons = req.body.seasons;
        movie.description = req.body.description;
        // then we need to save the new cover image if the user decides to update the cover image 
        if(req.body.cover != null && req.body.cover != ''){
            // we run the save cover function 
            saveCover(movie, req.body.cover);
        }
        // we then save our changes in the database 
        await movie.save();
        // then we redirect to our movies show page 
        res.redirect(`/movies/${movie.id}`);
    }catch{  
        const heros = await Hero.find({});
        // when there is an error we render out an error
        res.render('movies/edit', {
            heros: heros,
            movie: movie,
            errorMessage: "Error updating the movie"
        });
        
    }
});

// deleting movie route
router.delete('/:id', async (req, res)=>{
    // we give the delete button its functionality 
    let movie; // variable to store our movie retrieved from our database 
    try{
        movie = await Movie.findById(req.params.id); // we find the movie by its id 
        await movie.deleteOne(); // we delete the movie from our database 

        // then we have to redirect the use to our movies index page to see that the movie was deleted 
        res.redirect('/movies');
    }catch{
        // we render the movie's index/home page but with an error message.
        res.render('movies', {
            movie: movie, 
            errorMessage: 'Error Deleting The Movie'
        });
    }
});

// we create a function that saves our uploaded images into the mongoose database of our application 
// movie parameter is the movie we are creating or updating 
// coverEncoded: is the cover image details for the image being uploaded
function saveCover(movie, coverEncoded){
    // we have to first check and see if there is any images uploaded 
    if(coverEncoded == null || coverEncoded === ''){
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