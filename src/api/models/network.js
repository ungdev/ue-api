
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('network', {
    ip: { type: DataTypes.STRING, defaultValue: null },
    mac: { type: DataTypes.STRING, defaultValue: null },
    switchId: { type: DataTypes.INTEGER, defaultValue: null },
    switchPort: { type: DataTypes.INTEGER, defaultValue: null },
    isBanned: { type: DataTypes.BOOLEAN, defaultValue: false },
    isCaster: { type: DataTypes.BOOLEAN, defaultValue: false },
  })
}
