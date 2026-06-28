const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const errorHandler = require('./utils/ErrorHandler');

const cors = require("cors")

const cookieParser = require('cookie-parser');


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
const userRouter = require('./src/routers/userRouter');
const contactRouter = require('./src/routers/ContactRouter');
require('./src/associations/associations')


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/contacts", contactRouter);
app.use(errorHandler);



module.exports = app;