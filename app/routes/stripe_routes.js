// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
const dotenv = require('dotenv')
dotenv.config()
const keyPublishable = process.env.STRIPE_PUBLISHABLE_KEY
const keySecret = process.env.STRIPE_SECRET_KEY

// pull in Mongoose model for stripes
const stripe = require('stripe')(keySecret)

const order = require('../models/order')
// app.set('view engine', 'pug')
// app.use(require('body-parser').urlencoded({ extended: false }))
// app.get('/', (req, res) =>
// res.render('index.pug', { keyPublishable }))
// we'll use this to intercept any errors that get thrown and send them
// back to the client with the appropriate status code
// const handle = require('../../lib/error_handler')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// CREATE
// POST /
router.post('/charges', (req, res) => {
  console.log(req.body)
  // set owner of new stripe to be current user
  // let amount = 500
  chargeStripe(req)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err))

  // .then(res.send(keyPublishable))
  // .then(charge => res.status(201).json( {charge: charge.toObject() }))
  // .then(req.body.order.submitted === true)
  // stripe.customers.create({
  //   email: req.body.stripeEmail,
  //   source: req.body.stripeToken
  // })
  // .then(customer =>
  //   stripe.charges.create({
  //     amount,
  //     description: 'sample charge',
  //     currency: 'usd'
  //   }))
  // .then(charge => res.render('charge.pug'))
  // const orderId = req.params.id
  // const stripeToken = req.body.stripeToken
  // const charge = {
  //   amount: Order.total,
  //   currency: 'USD',
  //   card: stripeToken
  // }

  // stripe.charges.create(charge)
  //   .then(Order.update(orderId, req.body))
  //   .then(data => console.log('success ', data))
  //   .catch(console.error('failure'))

  // stripe.create(req.body.stripe)
  //   // respond to succesful `create` with status 201 and JSON of new "stripe"
  //   .then(stripe => {
  //     res.status(201).json({ stripe: stripe.toObject() })
  //   })
  //   // if an error occurs, pass it off to our error handler
  //   // the error handler needs the error message and the `res` object so that it
  //   // can send an error message back to the client
  //   .catch(err => handle(err, res))
})

const chargeStripe = req => {
  return stripe.charges.create({
    amount: 20000,
    currency: 'usd',
    description: `Nozama ${order.id}`,
    source: req.body.token.id
  })
}
module.exports = router
