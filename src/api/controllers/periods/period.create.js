const errorHandler = require("../../utils/errorHandler")
const { check } = require("express-validator/check")
const validateBody = require("../../middlewares/validateBody")

/**
 * POST /periods
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
  app.post("/periods", [check("name").exists(), validateBody()])
  app.post("/periods", async (req, res) => {
    const { Period } = req.app.locals.models

    try {
      const { name } = req.body
      let period = await Period.create({
        name
      })
      return res
        .status(200)
        .json(period)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
