module.exports = (sequelize, DataTypes) => {
  return sequelize.define('attribut_version', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    value: { type: DataTypes.STRING, defaultValue: null }
  })
}
