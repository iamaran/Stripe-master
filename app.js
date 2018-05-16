const keyPublishable = 'pk_test_U8OtLMtP4XrUN6tbLO5xn4vj';
const keySecret = 'sk_test_LvSbgg5QABt5C760wdO5tufl';

//need to decide what we are doing about keys!

const express = require("express");
const stripe = require("stripe")(keySecret);
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post("/charge", (req, res) => {

  var stripeToken = req.body.stripeToken;
  let amount = req.body.amount,
      clientref = req.body.clientref,
      fee = req.body.fee,
      allocate = req.body.allocate;
      
  console.log(JSON.stringify(req.body, null, 2))
    
  stripe.customers.create({
    card: stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount: fee,
      description: "Client Ref: " + clientref,
      currency: "gbp",
      customer: customer.id,
      metadata: {
        'allocation:': allocate
      }
    }))
  .then(charge => res.send(charge))
  .then(console.log(res))
  .catch(err => {
    console.log("Error:", err);
    res.status(500).send({error: "Purchase Failed"});
  });
});

app.listen(8000);