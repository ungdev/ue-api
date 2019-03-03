const errorHandler = require('../../utils/errorHandler')

/**
 * GET /ues/:id/versions/last
 *
 * Response:
 * [
 *    {
 *      id,
 *      createdAt,
 *     }, ...
 * ]
 */
module.exports = app => {
  app.get('/ues/:id/versions/last', async (req, res) => {
    const { Version, Attribute, Curriculum, Period, UE } = req.app.locals.models

    try {
      let ues = await Version.findAll({
        where: {
          ueId: req.params.id
        },
        order: [['createdAt', 'DESC']], // order by createdAt descendant
        attributes: [
          'id',
          'title',
          'goals',
          'programme',
          'ECTS',
          'deprecatedAt',
          'ueId'
        ],
        include: [
          {
            model: Attribute,
            attributes: ['id', 'name'],
            as: 'attributes',
            through: {
              attributes: ['id', 'value']
            }
          },
          {
            model: Curriculum,
            as: 'curriculums',
            attributes: ['id', 'name', 'parent'],
            through: {
              attributes: ['id']
            }
          },
          {
            model: Period,
            as: 'periods',
            attributes: ['id', 'name'],
            through: {
              attributes: ['id']
            }
          },
          {
            model: UE,
            as: 'requireds',
            attributes: ['id', 'name', 'code'],
            through: {
              attributes: ['id', 'importance']
            }
          }
        ]
      })
      if (ues.length === 0)
        return res
          .status(404)
          .json({ error: 'NO_VERSIONS' })
          .end()
      return res
        .status(200)
        .json(ues[0])
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
