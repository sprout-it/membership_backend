const express = require("express");
const { firestore } = require("../configs/firebase");
const router = express.Router();
const dayjs = require('dayjs')

router.get("/contract", async (req, res) => {
  try {
    let contract = [];
    const contractRef = await firestore.collection("order").get();
    await Promise.all(
      contractRef.docs.map((data) => {
        let obj = {
          docId: data.id,
          contractData: data.data(),
        };
        contract.push(obj);
      })
    );
    res.status(200).send(contract);
  } catch (error) {
    console.log(error);
  }
});

router.post("/contract", async (req, res) => {
  try {
    const { contract, totalPrice } = req.body;
    contract.contractData.status = "accepted";
    const name = contract.contractData.customer_name;
    const price = totalPrice;
    const aeId = contract.contractData.ae_id
    const size = (
      await firestore
        .collection("order")
        .where("ae_id", "==", `${aeId}`)
        .where("status","==","accepted")
        .get()
    ).size;
    let count=""
    const length = size.toString().length
    if (length==1) {
      count = "000"+size
    } else if (length==2) {
      count = "00"+size
    } else if (length==3) {
      count = "0"+size
    } else if (length==4) {
      count = size
    }
    const date = dayjs(Date.now()).format('DDMMYY')
    const quotation = `QT${aeId}${date}${count}`
    await firestore.collection("order").doc(contract.docId).set(contract.contractData);
    res.status(200).send({ name: name, price: price ,quotation:quotation});
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
