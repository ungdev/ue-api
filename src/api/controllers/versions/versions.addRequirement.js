const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')

/**
 * POST /versions/:id/requireds
 * 
 * Body : 
 * 
 * { ueId, importance }
 *
 * Response:
 * [
 *    { id, title, goals, programme, ECTS, updatedAt, createdAt }, ...
 * ]
 */
module.exports = app => {

  app.post('/versions/:id/requireds', [
    check('ueId')
      .exists(),
    check('importance')
      .isNumeric()
      .exists(),
    validateBody()
  ])
  app.post('/versions/:id/requireds', async (req, res) => {
    const { UE, Version } = req.app.locals.models

    try {
      const version = await Version.findById(req.params.id)
      if (!version)
        return res.status(404).json("Version not found").end()
      const ue = await UE.findById(req.body.ueId)
      if (!ue)
        return res.status(404).json("UE not found").end()
      await version.addUe(ue, { through: { importance: req.body.importance } })
      return res
        .status(200)
        .json(version)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}