const errorHandler = require('../../utils/errorHandler')

/**
 * GET /curriculums/:id
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

  app.get('/curriculums/:id', async (req, res) => {
    const { Curriculum } = req.app.locals.models

    try {
      let curriculum = await Curriculum.findById(req.params.id)
      let parents = [] //put every parent in this table
      parents.push({
        id: curriculum.id,
        name: curriculum.name
      })

      let { parent } = curriculum
      while (parent) {
        let newParent = await Curriculum.findById(parent)
        parents.push({
          id: newParent.id,
          name: newParent.name
        })
        parent = newParent.parent
      }
      return res
        .status(200)
        .json(parents)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}