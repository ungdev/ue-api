const errorHandler = require('../../utils/errorHandler')

/**
 * GET /ues
 *
 * Response:
 * [
 *    { id, name, code }, ...
 * ]
 */
module.exports = app => {

  app.get('/ues', async (req, res) => {
    const { UE } = req.app.locals.models

    try {
      let ues = await UE.findAll({
        attributes: ['id', 'name', 'code'],
        order: [['name', 'ASC']] // order by name ascendant
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