const errorHandler = require('../../utils/errorHandler')

/**
 * GET /versions/:id/curriculums
 * 
 *
 * Response:
 * [
 *    { id, versionId, curriculumId}, ...
 * ]
 */
module.exports = app => {

  app.get('/versions/:id/curriculums', async (req, res) => {
    const { CurriculumVersion } = req.app.locals.models

    try {
      const curriculumVersion = await CurriculumVersion.findAll({
        where: {
          versionId: req.params.id
        },
        attributes: ['curriculumId']
      })
      return res
        .status(200)
        .json(curriculumVersion)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}