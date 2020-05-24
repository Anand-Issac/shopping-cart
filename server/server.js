const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
let Ebay = require('ebay-node-api');

require('dotenv').config();

const ebay = new Ebay({
    clientID: process.env.REACT_APP_EBAY_APP_ID
});

// load index.html
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

// create a route to search items in eBay. 
app.use('/search', function(req, res){
    const queryParam = req.query;
    // call the ebay api
    ebay.findItemsByKeywords({
        keywords: queryParam.keyword,
        sortOrder: 'PricePlusShippingLowest', //https://developer.ebay.com/devzone/finding/callref/extra/fndcmpltditms.rqst.srtordr.html
        Condition: 3000,
        SoldItemsOnly: false,
        affiliate: {
            networkId: 9,
            trackingId: 1234567890
        }
    }).then((data) => {
        return res.status(200).send(data);
    }, (error) => {
        return res.status(404).send(data);
    });
});

// listen to the port.
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
