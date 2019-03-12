module.exports = (sequelize, DataTypes) => {
  return sequelize.define("version", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: { type: DataTypes.TEXT },
    goals: { type: DataTypes.TEXT },
    programme: { type: DataTypes.TEXT },
    ECTS: { type: DataTypes.INTEGER },
    deprecatedAt: { type: DataTypes.DATE }
  })
}
