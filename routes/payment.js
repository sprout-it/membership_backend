const express = require("express").Router();
require('dotenv').config()
const router = require('express-ws')(express).app;
const axios = require('axios')
const API = process.env.API_KEY
const SECRET = process.env.SECRET_KEY
const SCB_ENDPOINT = process.env.SCB_ENDPOINT
const SCB_REQUEST_UID = process.env.SCB_REQUEST_UID
const MERCHANT_ID = process.env.MERCHANT_ID
const { firestore } = require("../configs/firebase");

// router.ws('/wait');

router.post('/confirm', async (req, res) => {
    const { payerName, billPaymentRef1, billPaymentRef2 } = req.body
    // router.getWss('/wait').clients.forEach(client => {
    //     client.send('confirm')
    // })
    const wasPay = await firestore.collection("order").where('quotation', '==', billPaymentRef1).get();
    const [findMoreInfo] = wasPay.docs.map(item => item.data())
    let GrandTotal = 0

    findMoreInfo.cartItems.map((cart) => {
        GrandTotal += cart.ppu;
    });

    const toFinance = {
        OrderNo: billPaymentRef1,
        CustomerName: payerName,
        Item: [
            {
                ItemName: 'Membership Package',
                Qty: 1,
                Unitprice: 1,
                itemDiscount: 0,
            },
        ],
        Discount: 0,
        Vat: 7,
        GrandTotal,
        PaymentType: 1
    }

    const postFinance = await axios.post('https://bsv-th-authorities.com/UploadFile/api/ApiSprout/OrderRequest', toFinance)
    if (postFinance.data.status == 'Success') {
        //change state to Done
        // const [findDocs] = await firestore.collection("order").where('quotation', '==', billPaymentRef1).get();
    }
    res.send({ status: 'ok' })
})

// router.post('/wasPay', async (req, res) => {
//     const quotation = req.body.quotation
//     try {
//         const contractRef = await firestore.collection("order").where('quotation', '==', quotation).get();
//         if (contractRef.empty)
//             res.send({ wasPay: false })
//         else
//             res.send({ wasPay: true })
//     } catch (e) {
//         console.error(e)
//     }
// })

router.post('/payment', async (req, res) => {
    try {
        const { price, quotation } = req.body
        const token = await axios.post(`${SCB_ENDPOINT}/partners/sandbox/v1/oauth/token`, {
            "applicationKey": API,
            "applicationSecret": SECRET,
        }, {
            headers: {
                "resourceOwnerId": API,
                "requestUId": SCB_REQUEST_UID,
                "accept-language": "EN",
                "content-type": "application/json"
            }
        })

        const qrgen = await axios.post(`${SCB_ENDPOINT}/partners/sandbox/v1/payment/qrcode/create`,
            {
                "qrType": "PP",
                "ppType": "BILLERID",
                "ppId": MERCHANT_ID,
                "amount": price,
                "ref1": quotation,
                "ref2": quotation,
                "ref3": "SCB"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language': 'EN',
                    'authorization': `Bearer ${token.data.data.accessToken}`,
                    'requestUId': SCB_REQUEST_UID,
                    'resourceOwnerId': API,
                }
            }
        )
        res.status(200).send(qrgen.data)
    }
    catch (e) {
        console.error(e)
    }
})

router.get('/docs', (req, res) => {
    try {
        res.status(200).send(docs)
    } catch (e) {
        console.error(e)
    }
})

module.exports = router