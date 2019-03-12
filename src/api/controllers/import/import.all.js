const errorHandler = require('../../utils/errorHandler')
let doc = require('./uvs.json')

/**
 * POST /import
 *
 *
 * Response:
 * {
 *
 * }
 */
module.exports = app => {
  app.post('/import', async (req, res) => {
    const { UE, Version, Period, Attribute } = req.app.locals.models
    try {
      doc = doc.filter(ue => !ue.deletedAt && ue.isOld !== 1)
      let automne = await Period.findOne({ where: { name: 'Automne' } })
      let printemps = await Period.findOne({ where: { name: 'Printemps' } })
      let CM = await Attribute.findOne({ where: { name: 'CM' } })
      let TD = await Attribute.findOne({ where: { name: 'TD' } })
      let TP = await Attribute.findOne({ where: { name: 'TP' } })
      let THE = await Attribute.findOne({ where: { name: 'THE' } })
      for (let index = 0; index < doc.length; index++) {
        let uv = doc[index]
        let ue = await UE.create({
          code: uv.code,
          name: uv.code
        })
        let version = await Version.create({
          title: uv.name,
          goals: uv.objectifs,
          programme: uv.programme,
          ECTS: uv.credits
        })
        if (uv.automne === 1) {
          await version.addPeriod(automne)
        }
        if (uv.printemps === 1) {
          await version.addPeriod(printemps)
        }
        if (uv.cm > 0) {
          await version.addAttribute(CM, {
            through: { value: uv.cm }
          })
        }
        if (uv.td > 0) {
          await version.addAttribute(TD, {
            through: { value: uv.td }
          })
        }
        if (uv.tp > 0) {
          await version.addAttribute(TP, {
            through: { value: uv.tp }
          })
        }
        if (uv.the > 0) {
          await version.addAttribute(THE, {
            through: { value: uv.the }
          })
        }
        await ue.addVersion(version)
      }
      return res
        .status(200)
        .json(doc)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
