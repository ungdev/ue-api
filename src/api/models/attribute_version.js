module.exports = (sequelize, DataTypes) => {
  return sequelize.define('attribute_version', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    value: { type: DataTypes.STRING, defaultValue: null }
  })
}
