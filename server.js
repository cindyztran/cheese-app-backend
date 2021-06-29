//Dependencies

//get .env var
require('dotenv').config();

//pull port from .env, give default value of 3000
const { PORT = 4000, MONGODB_URL } = process.env;

//import express
const express = require('express');

//create application object
const app = express();

//import mongoose
const mongoose = require('mongoose');

//import middleware
const cors = require('cors');
const morgan = require('morgan');


//Database Connection
//Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

//Connection Events
mongoose.connection
    .on('open', () => console.log('mongo is connected'))
    .on('close', () => console.log('mongo is disconnected'))
    .on('error', (error) => console.log('error'));

//Models
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

//Middleware
app.use(cors()); //to prevent cors errors, open access to all origins
app.use(morgan("dev")); //logging
app.use(express.json());


//Routes
//create a test route
app.get('/', (req, res) => {
    res.send(`it ain't ez bein cheezy`);
});


// Cheese Index Route
app.get('/cheese', async (req, res) => {
    try {
        //send all cheese
        res.json(await Cheese.find({}));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

//Cheese Delete Route
app.delete('/cheese/:id', async (req, res) => {
    try {
        //send all cheese
        res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

//Cheese Update Route
app.put('/cheese/:id', async (req, res) =>{
    try {
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}));

    } catch (error) {
        //send error
        res.status(400).json(error);
    }
})

//Cheese Create Route
app.post('/cheese', async (req, res) => {
    //await response and send back json data created by await Cheese.create(req.body)
    try {
        res.json(await Cheese.create(req.body))
    } catch (error) {
        res.status(400).json(error);
    }
});

//listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
