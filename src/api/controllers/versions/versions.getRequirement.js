const errorHandler = require('../../utils/errorHandler')

/**
 * GET /versions/:id/requireds
 * 
 *
 * Response:
 * [
 *    { id, versionId, periodId}, ...
 * ]
 */
module.exports = app => {

  app.get('/versions/:id/requireds', async (req, res) => {
    const { Required } = req.app.locals.models

    try {
      const required = await Required.findAll({
        where: {
          versionId: req.params.id
        },
        attributes: ['ueId', 'importance']
      })
      return res
        .status(200)
        .json(required)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}