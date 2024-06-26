const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(functions.config().stripe.secret);

admin.initializeApp();

exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const {amount, currency} = req.body;

  if (!amount || !currency) {
    return res.status(400).send({error: "Invalid request parameters"});
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.status(200).send(paymentIntent);
  } catch (error) {
    res.status(500).send({error: error.message});
  }
});
