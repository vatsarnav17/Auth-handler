const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const mongoose = require('mongoose');
const userModel = require('./Models/user') 

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;


app.use(cors());

app.get('/ping',(req,res)=>{
    res.send('PONG');
})

app.get('/home',(req,res)=>{
    userModel.find()
    .then(users=> {
    console.log(users);
    res.json(users);})
    .catch(err=> res.status(500).json({error:'Failed to fetch users'}));
})
app.use(bodyParser.json());
app.use('/auth',AuthRouter);
app.use('/auth',require('./Routes/AuthRouter'));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`server is runnin on port ${PORT}`) 
});