const { check } = require('express-validator/check')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const validateBody = require('../../middlewares/validateBody')
const isLoginEnabled = require('../../middlewares/isLoginEnabled')
const mail = require('../../mail')
const env = require('../../../env')
const random = require('../../utils/random')
const { outputFields } = require('../../utils/publicFields')
const errorHandler = require('../../utils/errorHandler')
const log = require('../../utils/log')(module)

const hash = require('util').promisify(bcrypt.hash)

/**
 * POST /user
 * {
 *    name: String
 *    password: String
 *    email: String
 * }
 *
 * Response:
 * {
 *
 * }
 */
module.exports = app => {
  app.post('/user', [isLoginEnabled()])

  app.post('/user', [
    check('name')
      .exists()
      .matches(/[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzªµºÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĄąĆćĘęıŁłŃńŒœŚśŠšŸŹźŻżŽžƒˆˇˉμﬁﬂ \-]+/i)
      .isLength({ min: 3, max: 90 }),
    check('lastname')
      .exists()
      .matches(/[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzªµºÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĄąĆćĘęıŁłŃńŒœŚśŠšŸŹźŻżŽžƒˆˇˉμﬁﬂ \-]+/i)
      .isLength({ min: 2, max: 200 }),
    check('firstname')
      .exists()
      .matches(/[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzªµºÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĄąĆćĘęıŁłŃńŒœŚśŠšŸŹźŻżŽžƒˆˇˉμﬁﬂ \-]+/i)
      .isLength({ min: 2, max: 200 }),
    check('gender')
      .exists(),
    check('password')
      .exists()
      .isLength({ min: 6 }),
    check('email')
      .exists()
      .isEmail(),
    validateBody()
  ])

  app.post('/user', async (req, res) => {
    const { User } = req.app.locals.models

    try {
      req.body.barcode = random(env.ARENA_API_BARCODE_LENGTH)
      req.body.password = await hash(req.body.password, parseInt(env.ARENA_API_BCRYPT_LEVEL, 10))

      req.body.registerToken = uuid()
      const user = await User.create(req.body)

      await mail('user.register', user.email, {
        mail: user.email,
        link: `${env.ARENA_WEBSITE}/valid/${user.registerToken}`
      })

      log.info(`user ${req.body.name} created`)

      res
        .status(200)
        .json({})
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
