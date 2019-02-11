module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ue', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    code: { type: DataTypes.STRING, unique: true }, // code is the real code, like MTX1
    name: { type: DataTypes.STRING }, // name is the display name, like MATH01
  })
}
