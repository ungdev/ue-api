const env = require('../../../env')
const oauth2 = require('simple-oauth2')
const Url = require('url')

/*
  To log in, the user must first be redirected to etu.utt.fr, which will redirect
  to cas.utt.fr. Once logged, he will receive an authorization_code to get a token.
*/
module.exports = app => {
  app.post('/etuutt/token', async (req, res) => {
    try {
      this._baseUri = 'https://etu.utt.fr'
      let auth = oauth2.create({
        client: {
          id: env.ETU_UTT_CLIENT_ID,
          secret: env.ETU_UTT_CLIENT_SECRET
        },
        auth: {
          tokenHost: this._baseUri,
          tokenPath: Url.parse(this._baseUri).pathname + 'api/oauth/token',
          authorizePath: Url.parse(this._baseUri).pathname + 'api/oauth/authorize',
        }
      })
      let result2 = await auth.authorizationCode.getToken(
        {
          code: req.body.code
        },
        (error, result) => {
          if (!error) {
            return res
              .status(200)
              .json(result)
              .end()
          } else {
            return res
              .status(400)
              .json(error)
              .end()
          }
        }
      )
      return res
        .status(200)
        .json(result2)
        .end()
    } catch (err) {
      console.log(err)
      return res
        .status(500)
        .end()
    }
  })
}
