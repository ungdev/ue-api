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
  Curriculum.belongsToMany(Version, { through: CurriculumVersion, as: 'versions' })
  Version.belongsToMany(Curriculum, { through: CurriculumVersion, as: 'curriculums' })
  
  // link Curriculum to each other to make a tree
  Curriculum.belongsTo(Curriculum, { foreignKey: 'parent' })
  Curriculum.hasMany(Curriculum, { foreignKey: 'parent' })

  // link Required to Version
  UE.belongsToMany(Version, { through: Required, as: 'requiredsTo' })
  Version.belongsToMany(UE, { through: Required, as: 'requireds' })

  // link Period to Version
  Period.belongsToMany(Version, { through: PeriodVersion, as: 'versions' })
  Version.belongsToMany(Period, { through: PeriodVersion, as: 'periods' })

  // link attributs to versions through attribut_version
  Attribute.belongsToMany(Version, { through: AttributeVersion, as: 'versions' })
  Version.belongsToMany(Attribute, { through: AttributeVersion, as: 'attributes' })

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
