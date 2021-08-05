const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./Routes/user');
const app = express();

mongoose.connect('mongodb://localhost:27017/user-data', { useNewUrlParser: true, useUnifiedTopology: true } )
.then(() => {
  console.log("Connected to database");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.setHeader("Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, PUT, OPTIONS"
      );
      next();
  });

app.use('/api/user', userRoutes);

module.exports = app;