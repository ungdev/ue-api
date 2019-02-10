const http = require('http')
const database = require('./database')
const socket = require('./socket')
const arena = require('./arena')
const env = require('./env')
const toornament = require('./toornament')

module.exports = async function(app, express) {
  const { sequelize, models } = await database()

  arena(app)

  const server = http.Server(app)
  const io = socket(http, sequelize, models)

  app.locals.app = app
  app.locals.server = server
  app.locals.db = sequelize
  app.locals.models = models
  app.locals.io = io
  app.locals.toornament = toornament

  if (process.send) {
    process.send('ready')
  }

  return app
}
