const errorHandler = require('../../utils/errorHandler')

/**
 * GET /versions/:id/attributes
 * 
 *
 * Response:
 * [
 *    { id, versionId, attributeId}, ...
 * ]
 */
module.exports = app => {

  app.get('/versions/:id/attributes', async (req, res) => {
    const { AttributeVersion } = req.app.locals.models

    try {
      const attributeVersion = await AttributeVersion.findAll({
        where: {
          versionId: req.params.id
        },
        attributes: ['attributeId']
      })
      return res
        .status(200)
        .json(attributeVersion)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}