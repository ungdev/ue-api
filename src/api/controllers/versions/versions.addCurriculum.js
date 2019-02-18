const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')

/**
 * POST /versions/:id/curriculums
 * 
 * Body : 
 * 
 * { curriculumId }
 *
 * Response:
 * [
 *    { id, title, goals, programme, ECTS, updatedAt, createdAt }, ...
 * ]
 */
module.exports = app => {

  app.post('/versions/:id/curriculums', [
    check('curriculumId')
      .exists(),
    validateBody()
  ])
  app.post('/versions/:id/curriculums', async (req, res) => {
    const { Version, Curriculum } = req.app.locals.models

    try {
      const curriculum = await Curriculum.findById(req.body.curriculumId)
      if (!curriculum)
        return res.status(404).json("Curriculum not found").end()
      const version = await Version.findById(req.params.id)
      if (!version)
        return res.status(404).json("Version not found").end()
      await version.addCurriculum(curriculum)
      return res
        .status(200)
        .json(version)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}