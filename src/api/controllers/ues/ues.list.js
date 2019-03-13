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
    const { UE, Version } = req.app.locals.models

    try {
      let ues = await Version.findAll({
        attributes: ['title'],
        include: [{ model: UE, attributes: ['id', 'name'] }],
        where: { deprecatedAt: null }
      })
      ues = ues
        .map(ue => {
          return { id: ue.ue.id, name: ue.ue.name, title: ue.title }
        })
        .sort((a, b) => {
          if (a.name > b.name) return 1
          if (a.name < b.name) return -1
          return 0
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
