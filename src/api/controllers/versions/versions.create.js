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
      .isString()
      .exists(),
    check('goals')
      .isString()
      .exists(),
    check('programme')
      .isString()
      .exists(),
    check('ECTS')
      .isNumeric()
      .exists(),
    check('periods')
      .isArray()
      .optional(),
    check('requireds')
      .isArray()
      .optional(),
    check('attributes')
      .isArray()
      .optional(),
    check('curriculums')
      .isArray()
      .optional(),
    validateBody()
  ])
  app.post('/ues/:id/versions', async (req, res) => {
    const { UE, Version, Period, Attribute, Curriculum } = req.app.locals.models

    try {
      const { title, goals, programme, ECTS, periods, requireds, attributes, curriculums } = req.body
      let ue = await UE.findById(req.params.id)
      let version = await Version.create({
        title,
        goals,
        programme,
        ECTS
      })
      if (periods) {
        await Promise.all(periods.map(async (periodId) => {
          let period = await Period.findById(periodId)
          if(period)
            await version.addPeriod(period)
        }))
      }
      if (requireds) {
        await Promise.all(requireds.map(async (requirement) => {
          const ue = await UE.findById(requirement.ueId)
          if(ue)
            await version.addUe(ue, { through: { importance: requirement.importance } })
        }))
      }
      if (attributes) {
        await Promise.all(attributes.map(async (att) => {
          const attribute = await Attribute.findById(att.id)
          if(attribute)
            await version.addAttribute(attribute, { through: { value: att.value } })
        }))
      }
      if (curriculums) {
        await Promise.all(curriculums.map(async (curriculumId) => {
          const curriculum = await Curriculum.findById(curriculumId)
          if(curriculum)
            await version.addCurriculum(curriculum)
        }))
      }
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