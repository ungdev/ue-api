module.exports = (sequelize, DataTypes) => {
  return sequelize.define('cursus', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING },
  })
}
