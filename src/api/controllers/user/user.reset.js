const { check } = require('express-validator/check')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const validateBody = require('../../middlewares/validateBody')
const mail = require('../../mail')
const env = require('../../../env')
const errorHandler = require('../../utils/errorHandler')
const log = require('../../utils/log')(module)

/**
 * POST /user/reset
 * {
 *    email: String
 * }
 *
 * Response:
 * {
 *
 * }
 *
 * PUT /user/reset
 * {
 *    token: String,
 *    password: String
 * }
 */
module.exports = app => {
  app.post('/user/reset', [
    check('email')
      .exists()
      .isEmail(),
    validateBody()
  ])

  app.post('/user/reset', async (req, res) => {
    const { User } = req.app.locals.models
    const email = req.body.email

    try {
      const user = await User.findOne({ where: { email } })

      if (!user) {
        log.warn(`can not reset ${email}, user not found`)

        return res
          .status(400)
          .json({ error: 'INVALID_EMAIL' })
          .end()
      }

      user.resetToken = uuid()
      await user.save()
      await mail('user.reset', user.email, {
        mail: user.email,
        link: `${env.ARENA_WEBSITE}/reset/${user.resetToken}`
      })

      log.info(`user ${user.name} asked for mail reset`)

      res
        .status(200)
        .json({})
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })

  app.put('/user/reset', [
    check('password')
      .exists()
      .isLength({ min: 6 }),
    check('token')
      .exists()
      .isUUID(),
    validateBody()
  ])

  app.put('/user/reset', async (req, res) => {
    const { User } = req.app.locals.models

    try {
      const resetToken = req.body.token

      const user = await User.findOne({ where: { resetToken } })

      if (!user) {
        log.warn(`can not reset ${resetToken}, token not found`)

        return res
          .status(400)
          .json({ error: 'INVALID_TOKEN' })
          .end()
      }

      user.password = await bcrypt.hash(
        req.body.password,
        parseInt(env.ARENA_API_BCRYPT_LEVEL, 10)
      )

      user.resetToken = null

      await user.save()

      log.info(`user ${user.name} reseted his password`)

      res
        .status(200)
        .json({})
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
