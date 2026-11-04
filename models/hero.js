// here we will create our hero database model
// we will use mongoose to create our hero database model
// we import mongoose
const mongoose = require('mongoose');
// we import our movie database model
const Movie = require('../models/movie');
// we use mongoose to create our hero schema
const heroSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});


// we need to create a pre function that runs before the deleting action and it prevents us from deleting heros that still have movies asociated to them 
// it runs before the deleting action hence becoming a pre function
// document middleware since it occurs before deleting documents retrieved from the database 
// query middleware occur before actions occuring on instructions sent to the server 
// this one is a document middle ware document = true and query = false 

heroSchema.pre('deleteOne', {document: true, query: false}, async function(){
    // this means we are creating a pre function, it runs before the deleting action, it is a document middleware, it runs before an action that occurs on documents and asynchronous
    // we get our movies from the database according to the id of their hero associated to them.
    const movies = await Movie.find({hero: this.id}); // hero; is a property in our movie schema and this.id is the id of our hero. we find the movie using the id of its hero property

    // if there are movies that are related to the hero we don't delete the hero and we throw an error
    if(movies.length > 0){
        throw new Error("The hero still has movies associated to them.")
    }
});


// we export our database model for usage in our router
module.exports = mongoose.model('Hero', heroSchema);