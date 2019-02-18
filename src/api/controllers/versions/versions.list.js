const errorHandler = require('../../utils/errorHandler')

/**
 * GET /ues/:id/versions
 *
 * Response:
 * [
 *    {
 *      id,
 *      createdAt,
 *     }, ...
 * ]
 */
module.exports = app => {

  app.get('/ues/:id/versions', async (req, res) => {
    const { Version } = req.app.locals.models

    try {
      let ues = await Version.findAll({
        attributes: ['id', 'createdAt', 'deprecatedAt'],
        where: {
          ueId: req.params.id
        },
        order: [['createdAt', 'DESC']], // order by createdAt descendant
      })
      return res
        .status(200)
        .json(ues)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}