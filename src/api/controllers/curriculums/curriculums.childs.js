const errorHandler = require('../../utils/errorHandler')

/**
 * GET /curriculums/childs/:id
 *
 * Response:
 * [
 *  {
 *    id: UUID,
 *    name: String,
 *    lastChild: Boolean
 *   }, ...
 * ]
 */
module.exports = app => {
  app.get('/curriculums/childs/:id', async (req, res) => {
    const { Curriculum } = req.app.locals.models

    try {
      let curriculums = await Curriculum.findAll({
        attributes: ['id', 'name'],
        where: {
          parent: req.params.id
        },
        raw: true
      })
      let result = []
      for (let i = 0; i < curriculums.length; i++) {
        let curriculum = curriculums[i]
        const child = await Curriculum.findOne({
          attributes: ['id'],
          where: {
            parent: curriculum.id
          }
        })
        result.push({ ...curriculum, lastChild: child ? false : true })
      }
      return res
        .status(200)
        .json(result)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
