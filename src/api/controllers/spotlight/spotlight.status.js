const pick = require('lodash.pick')
const env = require('../../../env')
const { isSpotlightFull } = require('../../utils/isFull')
const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')

/**
 * GET /spotlights
 * {
 *
 * }
 *
 * Response:
 * {
 *    spotlights: [Spotlight]
 * }
 */
module.exports = app => {
  app.get('/spotlights', [isAuth()])
  app.get('/spotlights', async (req, res) => {
    const { Spotlight, Team, State } = req.app.locals.models

    try {
      let spotlights = await Spotlight.findAll({
        include: [Team, State]
      })

      spotlights = spotlights.map(spotlight => {
        spotlight = spotlight.toJSON()

        spotlight.isFull = isSpotlightFull(spotlight, true)

        return pick(spotlight, ['id', 'name', 'shortName', 'perTeam', 'maxPlayers', 'isFull', 'states', 'state', 'toornamentID'])
      })

      return res
        .status(200)
        .json(spotlights)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}

