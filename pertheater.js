// we require our dotenv dependency in-order to render our environment variables
require('dotenv').config();
// we import express 
const express = require('express');
// we import express-ejs-layouts dependency 
const expressLayouts = require('express-ejs-layouts');
// we import body-parser library
const bodyParser = require('body-parser');
// we import the method-override dependecy; it will make us able to send delete and put requests to our server
const methodOverride = require('method-override');
// we use express to create an app 
const app = express();

// we need to set up our view engine. this is what we will be using to generate views templates for our application
// ejs; Embedded Javascript will be our view engine since it allows us to write HTML templates that we can use as views for our application 
app.set('view engine', 'ejs');
// we need to set the directory for storing our views in our project. i.e. the origin of our views 
app.set('views', __dirname + '/views'); // this means that our views will be stored in the views folder 
// we have to set up the directory or origin for our application layouts 
app.set('layout', 'layouts/layout'); // this means that our application layout will be stored in the layouts folder 

// we need to tell our app to use our express layouts 
app.use(expressLayouts);
// we tell our express app to use body-parser library to extract data from html forms submitted by users
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
// we tell our app to use our method override dependency
app.use(methodOverride('_method')); // we will use _method when performing our method override tasks 
// we then tell our app to use the files in our public folder as static files 
app.use(express.static('public'));
// we tell our app to use json data
app.use(express.json());

// we import our index router that we created here 
const indexRouter = require('./routes/index');
// we import our heros router here
const herosRouter = require('./routes/heros');
// we import our movies router 
const moviesRouter = require('./routes/movies');

// we tell our app to use or index router 
app.use('/', indexRouter);
// we tell our app to use our heros router
app.use('/heros', herosRouter);
// we tell our app to use the movies router 
app.use('/movies', moviesRouter);

// we tell our app to listen, accept and respond to requests runnin on local host 3000
app.listen(3000, ()=>{console.log("Server is running on port 3000.")});

// we establish our connection to the mongodb database 
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);

// we establish our connection very well
const db = mongoose.connection;
// checking for errors in connection and also for successful connection 
db.on('error', ()=> {console.error(error)});
db.once('open', ()=>{console.log("Connected to the database successfully.")})