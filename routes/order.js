const express = require("express").Router();
const { firestore } = require("../configs/firebase");
const router = require("express-ws")(express).app;

router.get("/", async (req, res) => {
  try {
    res.status(200).json("Hello World");
  } catch (error) {
    console.log(error);
  }
});

// router.get("/order", async (req, res) => {
//   try {
//     const order = await firestore.collection("order").doc("hI8ZwP0ImILlufnjbuhE").get()
//     const a = Object.assign(order.data(),{requirement:[]})
//     console.log(a)
//     res.status(200).json(order.data())
//   } catch (error) {
//     console.log(error);
//   }
// });

router.post("/order", async (req, res) => {
  try {
    console.log(req.body);
    if (JSON.stringify(req.body) == "{}") {
      res.status(404).json({ message: "กรุณากรอกข้อมูล" });
    } else {
      const order = Object.assign(req.body, { requirement: [], ae_team: [] });
      await firestore.collection("order").add(order);
      res.status(200).json({ message: "บันทึกสำเร็จ" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
