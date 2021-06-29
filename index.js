const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 80;
var functions = require("firebase-functions");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const order = require('./routes/order')
const contract = require('./routes/contact')

app.use(order)
app.use(contract)
// exports.api = functions.region('asia-southeast2').https.onRequest(app)
app.listen(PORT, () => console.log(`Server is Running on ${PORT}`))