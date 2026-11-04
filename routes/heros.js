// here we will create our heros router and routes as well 
// we import express 
const express = require('express');
// we import our hero database model
const Hero = require('../models/hero');
// we need to import our movie database model
const Movie = require('../models/movie');
// use express to create a router 
const router = express.Router();

// we create our routes here

// for getting all heros
router.get('/', async (req, res) => {
    // now we have to add search options and search conditions that our server follows when a user searches for a certain hero
    // we create an empty search options object 
    let searchOptions = {};
    // then we need to check and see if the user has really entered something in the search input for our heros name request
    if(req.query.name != null && req.query.name === ''){
        // we check and see if their is a name in the request
        searchOptions.name = new RegExp(req.query.name, 'i'); // this creates a search condition that can be used to search for the heros name in the database 
        // and it is also case insesitive.
    }
    try{
        // we get heros from the database and store them in a variable
        const heros = await Hero.find(searchOptions); // we add our searchOptions object as our search condtion
        // we render our heros that we found onto our index heros page 
        res.render('heros/index', {
            heros: heros,
            // we also add our searchOptions object
            searchOptions: req.query
        });
    }catch{
        res.redirect('/');
    }
});

// for new heros
router.get('/new', (req, res) =>{
    res.render('heros/new', {hero: new Hero()}); // here we render the heros new page and also create a new empty hero object for creating our hero.
    // what object name we use here determines the object that we use in the ejs templates.
})

// create heros route 
router.post('/', async (req, res) =>{
    // we need to create our hero object here 
    const hero = new Hero({
        name: req.body.name
    });
    try{
        const newHero = await hero.save(); // we save our hero we created to the database 
        res.redirect(`/heros/${newHero.id}`); // this redirects the user to the heros show page
    }catch{
        // if there is an error we need to render the new page again but while also delivering an error message
        res.render('heros/new', {
            hero: hero, // object
            errorMessage: "Error Creating A Hero." // we need to show an error message
        })
    }
});

// we create the routes for showing our hero, editing our hero and also updating our hero
// we need an id because we are going to work on specific heros not all of them at large 

// showing hero route 
router.get('/:id', async (req, res)=>{
    try{
        // we get our hero by their id
        const hero = await Hero.findById(req.params.id);
        const movies = await Movie.find({hero: hero.id}).limit(10).exec();

        // we render our show page 
        res.render('heros/show', {
            hero: hero,
            movies: movies
        })
    }catch{
        res.redirect('/');  
    }
});

// editing hero route; the role of this route is to render our hero's edit page
router.get('/:id/edit', async (req, res)=>{
    // we get our hero from the database by their id
    try{
        const hero = await Hero.findById(req.params.id); // we use the id passed in the request
        // we render the authors edit views page
        res.render('heros/edit', {hero: hero});
    }catch{
        res.redirect('/heros'); // redirect to the heros index or home page 
    }
});

// updating hero route 
router.put('/:id', async (req, res) => {
    // we put here the code that will update our heros when we submit the edit page form to the server
    // we get our hero by their id from our database 
    let hero;  // variable to store our hero that we retrieve from our database 
    try{
        // we retrieve our hero from the database by its id
        hero = await Hero.findById(req.params.id); 
        // we update the hero's data
        hero.name = req.body.name; 
        // then we save our new changes in our database 
        await hero.save();
        // then we redirect the user to the hero's show page 
        res.redirect(`/heros/${hero.id}`);
    }catch{
        if(hero == null){
            // if the user did not enter a hero
            res.render('heros/edit', {
            hero: hero,
            errorMessage: 'Please Enter Hero Details'
        })
        }else{
            res.render('heros/edit', {
            hero: hero,
            errorMessage: 'Error Editing The Hero'
        })
        }
    }
});

// delete hero route
router.delete('/:id', async (req, res) =>{
    // we update our delete action code here 
    let hero;
    try{
        // first get our hero from the database and store them in a variable
        hero = await Hero.findById(req.params.id);
        // we delete our hero from the database 
        await hero.deleteOne();
        // then we render our hero's index page
        res.redirect('/heros');
    }catch{
        // we check if the hero is even there in the database
        if(hero == null){
            res.redirect('/heros');
        }else{
            res.redirect(`/heros/${hero.id}`);
        }
    }
});


// export the router for usage in our server 
module.exports = router; 