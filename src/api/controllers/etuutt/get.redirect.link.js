

/*
  To log in, the user must first be redirected to etu.utt.fr, which will redirect
  to cas.utt.fr. Once logged, he will receive an authorization_code to get a token.
*/
module.exports = app => {

  app.get('/etuutt/link', async (req, res) => {

    try {
      const redirectUri = `${process.env.ETU_UTT_BASEURI}/oauth/authorize?client_id=${process.env.ETU_UTT_CLIENT_ID}&scopes=public&response_type=code&state=xyz`
      return res
        .status(200)
        .json({ redirectUri })
        .end()
    } catch (err) {
      return res
        .status(500)
        .json(err)
        .end()
    }
    
  })
}