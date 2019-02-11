const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')

/**
 * POST /ues
 * 
 * Body : 
 * 
 * { code, name }
 *
 * Response:
 * [
 *    { id, code, name, updatedAt, createdAt }, ...
 * ]
 */
module.exports = app => {

  app.post('/ues', [
    check('code')
      .exists(),
    check('name')
      .exists(),
    validateBody()
  ])
  app.post('/ues', async (req, res) => {
    const { UE } = req.app.locals.models

    try {
      let ue = await UE.create({
        code: req.body.code,
        name: req.body.name,
      })
      return res
        .status(200)
        .json(ue)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}