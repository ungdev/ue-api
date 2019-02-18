const errorHandler = require("../../utils/errorHandler")
const { check } = require("express-validator/check")
const validateBody = require("../../middlewares/validateBody")

/**
 * POST /attributes
 *
 * Body :
 *
 * { name }
 *
 * Response:
 * {
 *    id, name, updatedAt, createdAt
 * }
 */
module.exports = app => {
  app.post("/attributes", [check("name").exists(), validateBody()])
  app.post("/attributes", async (req, res) => {
    const { Attribute } = req.app.locals.models

    try {
      const { name } = req.body
      let attribute = await Attribute.create({
        name
      })
      return res
        .status(200)
        .json(attribute)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
