module.exports = (sequelize, DataTypes) => {
  return sequelize.define('curriculum', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING },
  })
}
