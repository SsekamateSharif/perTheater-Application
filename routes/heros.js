// here we will create our heros router and routes as well 
// we import express 
const express = require('express');
// we import our hero database model
const Hero = require('../models/hero');
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
router.get('/:new', (req, res) =>{
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
        //res.redirect(`/heros/${newHero.id}`); // this redirects the user to the heros show page
        res.redirect('/heros'); // now we redirect the user to the heros index page 
    }catch{
        // if there is an error we need to render the new page again but while also delivering an error message
        res.render('heros/new', {
            hero: hero, // object
            errorMessage: "Error Creating A Hero." // we need to show an error message
        })
    }
})

// export the router for usage in our server 
module.exports = router;