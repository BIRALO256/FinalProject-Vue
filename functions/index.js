    const functions = require("firebase-functions");
    const stripeSecretKey = `
    sk_test_51PQUla2MAGtg9B9CENBoCTcEKFqAU89mo4UZJSc0PuOitkZCG3Ai6EIYy9T
    07ohJPrUOgJwrPsDJl5eC0ux07yul00hmcogTBK
    `;

    const stripe = require("stripe")(stripeSecretKey.trim());

    exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
    const {amount} = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        });

        res.status(200).send({
        clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({error: error.message});
    }
    });
