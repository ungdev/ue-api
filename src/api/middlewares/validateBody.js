const { validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')
const log = require('../utils/log')(module)

module.exports = () => (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    log.info('INVALID_FORM :', errors.mapped())
    return res
      .status(400)
      .json({ error: 'INVALID_FORM', details: errors.mapped() })
      .end()
  }

  req.body = matchedData(req)

  next()
}
