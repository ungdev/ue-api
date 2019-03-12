const errorHandler = require("../../utils/errorHandler")
const { check } = require("express-validator/check")
const validateBody = require("../../middlewares/validateBody")

/**
 * POST /curriculums
 *
 * Body :
 *
 * { name, [parentId] }
 *
 * Response:
 * {
 *    id, name, parentId, updatedAt, createdAt
 * }
 */
module.exports = app => {
  app.post("/curriculums", [check("name").exists(), check("parentId").optional(), validateBody()])
  app.post("/curriculums", async (req, res) => {
    const { Curriculum } = req.app.locals.models

    try {
      const { name, parentId } = req.body
      let parent = null
      if (parentId) {
        parent = await Curriculum.findById(parentId)
        if(!parent)
        return res
          .status(404)
          .json("Unknown parent")
          .end()
      }
      let curriculum = await Curriculum.create({
        name
      })
      if (parent)
        await parent.addCurriculum(curriculum)
      return res
        .status(200)
        .json(curriculum)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
