const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')

/**
 * POST /versions/:id/attributes
 * 
 * Body : 
 * 
 * { attributeId }
 *
 * Response:
 * [
 *    { id, title, goals, programme, ECTS, updatedAt, createdAt }, ...
 * ]
 */
module.exports = app => {

  app.post('/versions/:id/attributes', [
    check('attributeId')
      .exists(),
    validateBody()
  ])
  app.post('/versions/:id/attributes', async (req, res) => {
    const { Version, Attribute } = req.app.locals.models

    try {
      const attribute = await Attribute.findById(req.body.attributeId)
      if (!attribute)
        return res.status(404).json("Attribute not found").end()
      const version = await Version.findById(req.params.id)
      if (!version)
        return res.status(404).json("Version not found").end()
      await version.addAttribute(attribute)
      return res
        .status(200)
        .json(version)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}