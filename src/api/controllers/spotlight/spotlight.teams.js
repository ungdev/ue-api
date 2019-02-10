const isAuth = require('../../middlewares/isAuth')
const errorHandler = require('../../utils/errorHandler')
const isInSpotlight = require('../../utils/isInSpotlight')
const { outputFields } = require('../../utils/publicFields')

/**
 * GET /user
 *
 * Response:
 * {
 *    user: User
 *    token: String,
 *    spotlights: [Spotlight]
 *    teams: [Team]
 *    teamfinders: [Teamfinder],
 *    prices: Object
 * }
 */
module.exports = app => {
  app.get('/spotlights/:id/teams', [isAuth()])

  app.get('/spotlights/:id/teams', async (req, res) => {
    const { Team, User, AskingUser } = req.app.locals.models

    try {
      let teams = await Team.findAll({
        where: { spotlightId: req.params.id },
        include: [
          {
            model: User
          },
          {
            model: User,
            through: AskingUser,
            as: 'AskingUser'
          }
        ]
      })
      if(!teams) return res.status(404).json('SPOTLIGHT_NOT_FOUND').end()
      teams = await Promise.all(teams.map(async team => {
        team = team.toJSON()
        if (team.AskingUser) {
          team.askingUsers = team.AskingUser.map(teamUser => {
            // clean the user
            const cleanedUser = outputFields(teamUser)

            // add data from join table
            cleanedUser.askingMessage = teamUser.askingUser.message

            return cleanedUser
          })

          delete team.AskingUser
        }
        team.isInSpotlight = await isInSpotlight(team.id, req)
        return {
          ...team,
          users: team.users.map(user => {
          return {
            id: user.id,
            name: user.name,
            role: user.role,
          }})
        }
      }))
      return res
        .status(200)
        .json(teams)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
