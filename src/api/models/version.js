module.exports = (sequelize, DataTypes) => {
  return sequelize.define("version", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: { type: DataTypes.STRING },
    goals: { type: DataTypes.STRING },
    programme: { type: DataTypes.STRING },
    ECTS: { type: DataTypes.INTEGER },
    deprecatedAt: { type: DataTypes.DATE }
  })
}
