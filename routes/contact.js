const express = require("express");
const { firestore } = require("../configs/firebase");
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs')
const privateKey = fs.readFileSync('./configs/private.pem', 'utf8');

router.get("/contract", async (req, res) => {
    try {
      res.status(200).json("Hello World")
    } catch (error) {
      console.log(error);
    }
  });

router.post("/contract", async (req, res) => {
  try {
    // await firestore.collection("order").add(req.body);
    const payload = {
        name:"กาย" ,
        price: 3000,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
  }
  let encoded = jwt.sign(payload, privateKey, { algorithm: 'HS256' });
    res.status(200).send(encoded)
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
