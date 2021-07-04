const express = require("express").Router();
require('dotenv').config()
const router = require('express-ws')(express).app;
const axios = require('axios')
const API = process.env.API_KEY
const SECRET = process.env.SECRET_KEY
const SCB_ENDPOINT = process.env.SCB_ENDPOINT
const SCB_REQUEST_UID = process.env.SCB_REQUEST_UID
const MERCHANT_ID = process.env.MERCHANT_ID

router.ws('/wait');

router.get('/confirm', (req, res) => {
    router.getWss('/wait').clients.forEach(client => {
        client.send('confirm')
    })
    res.send('ok')
})

router.get('/payment', async (req, res) => {
    try {
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
                "amount": "1.00",
                "ref1": "REFERENCE1",
                "ref2": "REFERENCE2",
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