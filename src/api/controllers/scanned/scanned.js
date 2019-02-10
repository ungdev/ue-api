const isAuth = require('../../middlewares/isAuth')
const errorHandler = require('../../utils/errorHandler')
const { isTeamFull } = require('../../utils/isFull')
const { outputFields } = require('../../utils/publicFields')
const log = require('../../utils/log')(module)

/**
 * GET /scanned
 *
 * Response:
 * 
 */
module.exports = app => {
  app.get('/scanned', [isAuth()])

  app.get('/scanned', async (req, res) => {
    const { Team, User, Spotlight } = req.app.locals.models

    let spotlightsData = []

    try {
      let spotlights = await Spotlight.findAll({
        include: [{
          model: Team,
          include: [{
            model: User
          }]
        }]
      })

      spotlights.forEach(spotlight => {
        let authorized = false

        if(req.user && req.user.permission) {
          if(req.user.permission.admin) {
            authorized = true
          }
          else if(req.user.permission.respo && req.user.permission.respo.includes(spotlight.id)) {
            authorized = true
          }
        }

        if(!authorized) {
          return null
        }

        let teams = spotlight.teams.filter(team => isTeamFull(team, spotlight.perTeam, true))
        teams = teams.map(team => {
          let scannedCount = 0
          let users = team.users.map(user => {
            if(user.scanned) {
              scannedCount++
            }

            return outputFields(user)
          })

          return {
            name: team.name,
            scannedCount,
            perTeam: spotlight.perTeam,
            users
          }
        })

        spotlightsData.push({
          spotlightName: spotlight.name,
          teams
        })
      })

      return res
        .status(200)
        .json(spotlightsData)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
