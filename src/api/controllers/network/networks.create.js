const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const errorHandler = require('../../utils/errorHandler')

/**
 * POST /network
 *
 * Response:
 * 
 */
module.exports = app => {
  app.post('/networks', [
    check('mac')
      .exists(),
    check('ip')
      .exists(),
    validateBody()
  ])

  app.post('/networks', async (req, res) => {
    const { Network } = req.app.locals.models
    const { mac, ip } = req.body
    try {
      let nw = await Network.findOne({ where: {
        mac
      } })
      if(!nw) nw = await Network.create({ mac, ip })
      else {
        nw.ip = ip
        await nw.save()
      }
      return res
        .status(200)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
