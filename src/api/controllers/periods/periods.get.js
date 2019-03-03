const errorHandler = require('../../utils/errorHandler')

/**
 * GET /periods/:id
 *
 * Response:
 *    {
 *      id,
 *      name,
 *      createdAt,
 *      updatedAt
 *    }
 */
module.exports = app => {
  app.get('/periods/:id', async (req, res) => {
    const { Period } = req.app.locals.models

    try {
      let period = await Period.findById(req.params.id)
      return res
        .status(200)
        .json(period)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
