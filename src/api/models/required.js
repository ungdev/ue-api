module.exports = (sequelize, DataTypes) => {
  return sequelize.define('required', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    importance: { type: DataTypes.STRING },
  })
}
