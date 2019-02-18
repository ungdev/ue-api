module.exports = function(sequelize) {
  const UE = sequelize.import(`${__dirname}/ue`)
  const Version = sequelize.import(`${__dirname}/version`)
  const Curriculum = sequelize.import(`${__dirname}/curriculum`)
  const CurriculumVersion = sequelize.import(`${__dirname}/curriculum_version`)
  const Attribute = sequelize.import(`${__dirname}/attribute`)
  const AttributeVersion = sequelize.import(`${__dirname}/attribute_version`)
  const Period = sequelize.import(`${__dirname}/period`)
  const PeriodVersion = sequelize.import(`${__dirname}/period_version`)
  const Required = sequelize.import(`${__dirname}/required`)


  // link Version to UE
  Version.belongsTo(UE)
  UE.hasMany(Version)

  // link Curriculum to Version
  Curriculum.belongsToMany(Version, { through: CurriculumVersion, as: 'version' })
  Version.belongsToMany(Curriculum, { through: CurriculumVersion, as: 'curriculum' })
  
  // link Curriculum to each other to make a tree
  Curriculum.belongsTo(Curriculum, { foreignKey: 'parent' })
  Curriculum.hasMany(Curriculum, { foreignKey: 'parent' })

  // link Required to Version
  UE.belongsToMany(Version, { through: Required })
  Version.belongsToMany(UE, { through: Required })

  // link Period to Version
  Period.belongsToMany(Version, { through: PeriodVersion })
  Version.belongsToMany(Period, { through: PeriodVersion })

  // link attributs to versions through attribut_version
  Attribute.belongsToMany(Version, { through: AttributeVersion, as: 'version' })
  Version.belongsToMany(Attribute, { through: AttributeVersion, as: 'attribute' })

  return {
    UE,
    Version,
    Curriculum,
    CurriculumVersion,
    Attribute,
    AttributeVersion,
    Period,
    PeriodVersion,
    Required
  }
}
