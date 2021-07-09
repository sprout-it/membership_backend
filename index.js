const express = require("express");
const app = require('express-ws')(express()).app;
const cors = require("cors");
const PORT = process.env.PORT || 80;
var functions = require("firebase-functions");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const order = require('./routes/order')
const contract = require('./routes/contact')
const payment = require('./routes/payment')

app.use(order)
app.use(contract)
app.use(payment)
// exports.api = functions.region('asia-southeast2').https.onRequest(app)
app.listen(PORT, () => console.log(`Server is Running on ${PORT}`))