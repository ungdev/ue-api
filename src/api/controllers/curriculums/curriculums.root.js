const errorHandler = require('../../utils/errorHandler')

/**
 * GET /curriculums/roots
 *
 * Response:
 * [
 *  {
 *    id,
 *    name,
 *   }, ...
 * ]
 */
module.exports = app => {

  app.get('/curriculums/roots', async (req, res) => {
    const { Curriculum } = req.app.locals.models

    try {
      let curriculums = await Curriculum.findAll({
        attributes: ['id', 'name'],
        where: {
          parent: null
        }
      })
      return res
        .status(200)
        .json(curriculums)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}