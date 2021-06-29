const express = require("express");
const { firestore } = require("../configs/firebase");
const router = express.Router();

router.get("/contract", async (req, res) => {
  try {
    let contract = []
    const contractRef = await firestore.collection("order").get()
    await Promise.all(contractRef.docs.map((data)=>{
      let obj = {
        docId:data.id,
        contractData:data.data()
      }
      contract.push(obj)
    }))
    res.status(200).send(contract);
  } catch (error) {
    console.log(error);
  }
});

router.post("/contract", async (req, res) => {
  try {
    await firestore.collection("order").add(req.body);
    res.status(200).send("บันทึกออเดอร์สำเร็จ");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
