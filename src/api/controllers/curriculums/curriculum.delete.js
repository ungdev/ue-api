const errorHandler = require('../../utils/errorHandler')

/**
 * DELETE /curriculums/id
 *
 *
 */
module.exports = app => {
  app.delete('/curriculums/:id', async (req, res) => {
    const { Curriculum } = req.app.locals.models

    try {
      const found = await Curriculum.findOne({
        attributes: ['id'],
        where: {
          parent: req.params.id
        }
      })
      if (found) {
        return res
          .status(400)
          .json({ error: 'HAS_CHILDREN' })
          .end()
      }
      await Curriculum.destroy({ where: { id: req.params.id } })

      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
