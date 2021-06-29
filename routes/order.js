const express = require("express");
const { firestore } = require("../configs/firebase");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
      res.status(200).json("Hello World")
    } catch (error) {
      console.log(error);
    }
  });

router.post("/order", async (req, res) => {
  try {
    await firestore.collection("order").add(req.body);
    res.status(200).json({message:"บันทึกสำเร็จ"})
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
