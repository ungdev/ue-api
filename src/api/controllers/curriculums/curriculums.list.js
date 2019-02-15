const errorHandler = require('../../utils/errorHandler')

/**
 * GET /curriculums
 *
 * Response:
 * [
 *    {
 *      id,
 *      name,
 *      parent,
 *      createdAt,
 *      updatedAt
 *    },...
 * ]
 */
module.exports = app => {

  app.get('/curriculums', async (req, res) => {
    const { Curriculum } = req.app.locals.models

    try {
      let curriculums = await Curriculum.findAll()
      return res
        .status(200)
        .json(curriculums)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}