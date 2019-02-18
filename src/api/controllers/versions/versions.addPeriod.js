const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')

/**
 * POST /versions/:id/periods
 * 
 * Body : 
 * 
 * { periodId }
 *
 * Response:
 * [
 *    { id, title, goals, programme, ECTS, updatedAt, createdAt }, ...
 * ]
 */
module.exports = app => {

  app.post('/versions/:id/periods', [
    check('periodId')
      .exists(),
    validateBody()
  ])
  app.post('/versions/:id/periods', async (req, res) => {
    const { Version, Period } = req.app.locals.models

    try {
      const period = await Period.findById(req.body.periodId)
      if (!period)
        return res.status(404).json("Period not found").end()
      const version = await Version.findById(req.params.id)
      if (!version)
        return res.status(404).json("Version not found").end()
      await version.addPeriod(period)
      return res
        .status(200)
        .json(version)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}