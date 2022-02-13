const path = require('path')
const express = require('express');
const cors = require('cors');

//INCLUDES 

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');


const app = express ();

//CORS 

var corsOptions = { /*pk var et pas let*/
    origin: "*"
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//USE ROUTES

app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);

//route de test
app.get("/", (req, res) => {
    res.json({ message: "Welcome to my application."});
});

app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;