const errorHandler = require('../../utils/errorHandler')

/**
 * GET /periods
 *
 * Response:
 * [
 *    {
 *      id,
 *      name
 *    },...
 * ]
 */
module.exports = app => {
  app.get('/periods', async (req, res) => {
    const { Period } = req.app.locals.models

    try {
      let periods = await Period.findAll({
        attributes: ['id', 'name']
      })
      return res
        .status(200)
        .json(periods)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
