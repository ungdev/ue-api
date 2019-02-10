const isAdmin = require('../../middlewares/isAdmin')
const isAuth = require('../../middlewares/isAuth')
const errorHandler = require('../../utils/errorHandler')
const log = require('../../utils/log')(module)

/**
 * PUT /admin/setPermissions/:id
 *
 * Response: none
 *
 */
module.exports = app => {
  app.put('/admin/setPermission/:id', [isAuth(), isAdmin()])

  app.put('/admin/setPermission/:id', async (req, res) => {
    const { Permission } = req.app.locals.models

    try {
      let reqPermission = req.body.permission
      if (!reqPermission) {
        return res
          .status(400)
          .json({ error: 'BAD_REQUEST' })
          .end()
      }

      let permission = await Permission.find({
        where: { userId: req.params.id }
      })

      if (permission) {
        permission.permission = reqPermission.toString()
        await permission.save()
      } else {
        permission = await Permission.create({
          userId: req.params.id,
          permission: reqPermission.toString()
        })
      }

      // Destroy row if user has no permissions
      if((!permission.admin || permission.admin === 0) && !permission.respo && !permission.permission) {
        permission.destroy()
      }

      return res.status(200).end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
