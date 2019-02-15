const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')

/**
 * POST /ues/:ueid/versions
 * 
 * Body : 
 * 
 * { title, goals, programme, ECTS }
 *
 * Response:
 * [
 *    { id, title, goals, programme, ECTS, updatedAt, createdAt }, ...
 * ]
 */
module.exports = app => {

  app.post('/ues/:id/versions', [
    check('title')
      .exists(),
    check('goals')
      .exists(),
    check('programme')
      .exists(),
    check('ECTS')
      .exists(),
    validateBody()
  ])
  app.post('/ues/:id/versions', async (req, res) => {
    const { UE, Version } = req.app.locals.models

    try {
      const { title, goals, programme, ECTS } = req.body
      let ue = await UE.findById(req.params.id)
      let version = await Version.create({
        title,
        goals,
        programme,
        ECTS
      })
      await ue.addVersion(version)
      return res
        .status(200)
        .json(version)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}