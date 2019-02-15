const errorHandler = require("../../utils/errorHandler")
const { check } = require("express-validator/check")
const validateBody = require("../../middlewares/validateBody")

/**
 * PUT /curriculums/id
 *
 * Body :
 *
 * { [name], [parentId] }
 *
 * Response:
 * {
 *    id, name, parentId, updatedAt, createdAt
 * }
 */
module.exports = app => {
  app.put("/curriculums/:id", [check("name").optional(), check("parentId").optional(), validateBody()])
  app.put("/curriculums/:id", async (req, res) => {
    const { Curriculum } = req.app.locals.models

    try {
      const { name, parentId } = req.body
      if(!parentId && !name)
        return res
          .status(400)
          .json("Missing params")
          .end()
      let curriculum = await Curriculum.findById(req.params.id)
      if(!curriculum)
        return res
          .status(404)
          .json("Curriculum not found")
          .end()
      if (parentId) {
        let parent = await Curriculum.findById(parentId)
        if(!parent)
          return res
            .status(404)
            .json("Unkown parent")
            .end()
          await parent.addCurriculum(curriculum)
      }
      if (name) {
        curriculum.name = name
      }
      await curriculum.save()
      return res
        .status(200)
        .json(curriculum)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
