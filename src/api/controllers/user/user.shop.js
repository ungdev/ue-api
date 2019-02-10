const jwt = require('jsonwebtoken')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const env = require('../../../env')
const Base64 = require('js-base64').Base64
const errorHandler = require('../../utils/errorHandler')
const etupay = require('@ung/node-etupay')({
  id: env.ARENA_ETUPAY_ID,
  url: env.ARENA_ETUPAY_URL,
  key: env.ARENA_ETUPAY_KEY
})

const Basket = etupay.Basket

const euro = 100
const gender = { H: 'Homme', F: 'Femme' }

/**
 * POST /user/shop
 * {
 *    plusone: Boolean,
 *    ethernet: Boolean,
 *    shirtGender: String?,
 *    shirtSize: String?
 * }
 *
 * Response:
 * {
 *    url: String
 * }
 */
module.exports = app => {
  app.post('/user/shop', [isAuth('user-pay')])

  app.post('/user/shop', [
    check('ethernet')
      .exists()
      .isBoolean(),
    check('ethernet7')
      .exists()
      .isBoolean(),
    check('tombola')
      .optional(),
    check('shirtGender')
      .optional()
      .isIn(['H', 'F']),
    check('shirtSize')
      .optional()
      .isIn(['XS', 'S', 'M', 'L', 'XL']),
    check('kaliento')
      .optional(),
    check('mouse')
      .optional(),
    check('keyboard')
      .optional(),
    check('headset')
      .optional(),
    check('screen24')
      .optional(),
    check('screen27')
      .optional(),
    check('chair')
      .optional(),
    check('gamingPC')
      .optional(),
    check('streamingPC')
      .optional(),
    check('laptop')
      .optional(),
    validateBody()
  ])

  app.post('/user/shop', async (req, res) => {
    if(env.ARENA_PAYMENT_DISABLED === '1') return res.status(404).json({ error: 'PAYMENT_DISABLED' }).end()
    try {
      let order = {}
      order.ethernet = req.body.ethernet ? req.body.ethernet : false
      order.ethernet7 = req.body.ethernet7 ? req.body.ethernet7 : false
      order.tombola = req.body.tombola ? req.body.tombola : 0
      order.kaliento = req.body.kaliento ? req.body.kaliento : false
      order.mouse = req.body.mouse ? req.body.mouse : false
      order.keyboard = req.body.keyboard ? req.body.keyboard : false
      order.headset = req.body.headset ? req.body.headset : false
      order.screen24 = req.body.screen24 ? req.body.screen24 : false
      order.screen27 = req.body.screen27 ? req.body.screen27 : false
      order.chair = req.body.chair ? req.body.chair : false
      order.gamingPC = req.body.gamingPC ? req.body.gamingPC : false
      order.streamingPC = req.body.streamingPC ? req.body.streamingPC : false
      order.laptop = req.body.laptop ? req.body.laptop : false
      order.shirt = 'none'

      if (req.body.shirtGender && req.body.shirtSize) {
        order.shirt = req.body.shirtGender.toLowerCase() + req.body.shirtSize.toLowerCase()
      }
      //save order
      order = await req.app.locals.models.Order.create(order)
      order.setUser(req.user)
      const data = Base64.encode(JSON.stringify({ userId: req.user.id, isInscription: false, orderId: order.id }))

      const basket = new Basket(
        'Achats supplémentaires UTT Arena 2018',
        req.user.firstname,
        req.user.lastname,
        req.user.email,
        'checkout',
        data
      )
      if (order.ethernet) basket.addItem('Cable Ethernet 5m', euro * env.ARENA_PRICES_ETHERNET, 1)
      if (order.ethernet7) basket.addItem('Cable Ethernet 7m', euro * env.ARENA_PRICES_ETHERNET7, 1)
      if (order.kaliento) basket.addItem('Location Kaliento', euro * env.ARENA_PRICES_KALIENTO, 1)
      if (order.mouse) basket.addItem('Location Souris', euro * env.ARENA_PRICES_MOUSE, 1)
      if (order.keyboard) basket.addItem('Location Clavier', euro * env.ARENA_PRICES_KEYBOARD, 1)
      if (order.headset) basket.addItem('Location Casque', euro * env.ARENA_PRICES_HEADSET, 1)
      if (order.screen24) basket.addItem('Location Ecran 24"', euro * env.ARENA_PRICES_SCREEN24, 1)
      if (order.screen27) basket.addItem('Location Ecran 27"', euro * env.ARENA_PRICES_SCREEN27, 1)
      if (order.chair) basket.addItem('Location Chaise Gaming', euro * env.ARENA_PRICES_CHAIR, 1)
      if (order.gamingPC) basket.addItem('Location PC Gaming', euro * env.ARENA_PRICES_GAMING_PC, 1)
      if (order.streamingPC) basket.addItem('Location PC Streaming', euro * env.ARENA_PRICES_STREAMING_PC, 1)
      if (order.laptop) basket.addItem('Location PC Portable', euro * env.ARENA_PRICES_LAPTOP, 1)
      if (order.tombola > 0) basket.addItem('Tombola', euro * env.ARENA_PRICES_TOMBOLA, order.tombola)
      if (order.shirt !== 'none') {
        basket.addItem(
          `T-Shirt ${gender[req.body.shirtGender]} ${req.body.shirtSize}`,
          euro * env.ARENA_PRICES_SHIRT,
          1
        )
      }
      return res
        .status(200)
        .json({ url: basket.compute() })
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
