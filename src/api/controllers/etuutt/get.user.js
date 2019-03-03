const axios = require('axios')

/*
  To log in, the user must first be redirected to etu.utt.fr, which will redirect
  to cas.utt.fr. Once logged, he will receive an authorization_code to get a token.
*/
module.exports = app => {
  app.get('/etuutt/user', async (req, res) => {
    try {
      this._baseUri = 'https://etu.utt.fr'
      const response = await axios.get(
        'https://etu.utt.fr/api/public/user/account',
        {
          headers: {
            Authorization: ' Bearer ' + req.get('X-Token')
          }
        }
      )
      return res
        .status(200)
        .json(response.data.data)
        .end()
    } catch (err) {
      console.log(err)
      return res.status(500).end()
    }
  })
}
