// here we will make our movies database model using mongoose
const mongoose = require('mongoose');
// we create our database model schema
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    // we reference a hero to the movie using the hero's object id
    // the hero property of our schema model will store the object id of the hero associated with this movie.
    hero: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // the reference database model
        ref: 'Hero'
    },
    publishDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    seasons: {
        type: Number,
        required: true
    },
    coverImage:{
        type: Buffer, // simply because this property will be accepting  images in form of binary data 
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

// we need to create a coverImagePath that we will use to access our cover images from the database and then display them on our system.
// it enables us to access our uploaded images from the database 
movieSchema.virtual('coverImagePath').get(function(){
    // we check if there is a cover image in the database 
    if(this.coverImage != null && this.coverImage != ''){
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString(`base64`)}`; // this is the data of the image we want to retrieve from the database 
    }
})
// we export our database model
module.exports = mongoose.model('Movie', movieSchema);