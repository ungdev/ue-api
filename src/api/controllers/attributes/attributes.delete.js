const errorHandler = require('../../utils/errorHandler')

/**
 * DELETE /attributes/:id
 *
 */
module.exports = app => {
  app.delete('/attributes/:id', async (req, res) => {
    const { Attribute } = req.app.locals.models

    try {
      await Attribute.destroy({ where: { id: req.params.id } })
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
