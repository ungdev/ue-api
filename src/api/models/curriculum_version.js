module.exports = (sequelize, DataTypes) => {
  return sequelize.define('curriculum_version', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
  })
}
