const errorHandler = require('../../utils/errorHandler')

/**
 * GET /versions/:id/periods
 * 
 *
 * Response:
 * [
 *    { id, versionId, periodId}, ...
 * ]
 */
module.exports = app => {

  app.get('/versions/:id/periods', async (req, res) => {
    const { PeriodVersion } = req.app.locals.models

    try {
      const periodVersion = await PeriodVersion.findAll({
        where: {
          versionId: req.params.id
        },
        attributes: ['id', 'periodId', 'versionId']
      })
      return res
        .status(200)
        .json(periodVersion)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}