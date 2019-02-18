const errorHandler = require('../../utils/errorHandler')

/**
 * GET /attributes
 *
 * Response:
 * [
 *    {
 *      id,
 *      name,
 *      createdAt,
 *      updatedAt
 *    },...
 * ]
 */
module.exports = app => {

  app.get('/attributes', async (req, res) => {
    const { Attribute } = req.app.locals.models

    try {
      let attributes = await Attribute.findAll()
      return res
        .status(200)
        .json(attributes)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}