const errorHandler = require("../../utils/errorHandler")
const { check } = require("express-validator/check")
const validateBody = require("../../middlewares/validateBody")

/**
 * PUT /attribute/:id
 *
 * Body :
 *
 * { [name] }
 *
 * Response:
 * {
 *    id, name, updatedAt, createdAt
 * }
 */
module.exports = app => {
  app.put("/attributes/:id", [check("name").exists(), validateBody()])
  app.put("/attributes/:id", async (req, res) => {
    const { Attribute } = req.app.locals.models

    try {
      const { name } = req.body
      let attribute = await Attribute.findById(req.params.id)
      if(!attribute)
        return res
          .status(404)
          .json("Attribute not found")
          .end()
      attribute.name = name
      await attribute.save()
      return res
        .status(200)
        .json(attribute)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
