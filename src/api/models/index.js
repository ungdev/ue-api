module.exports = function(sequelize) {
  const UE = sequelize.import(`${__dirname}/ue`)
  const Version = sequelize.import(`${__dirname}/version`)
  const Curriculum = sequelize.import(`${__dirname}/curriculum`)
  const CurriculumVersion = sequelize.import(`${__dirname}/curriculum_version`)
  const Attribut = sequelize.import(`${__dirname}/attribut`)
  const AttributVersion = sequelize.import(`${__dirname}/attribut_version`)
  const Period = sequelize.import(`${__dirname}/period`)
  const PeriodVersion = sequelize.import(`${__dirname}/period_version`)
  const Degree = sequelize.import(`${__dirname}/degree`)
  const Required = sequelize.import(`${__dirname}/required`)


  // link Version to UE
  Version.belongsTo(UE)
  UE.hasMany(Version)

  // link Degree to Version
  Degree.belongsTo(Version)
  Version.hasMany(Degree)

  // link Curriculum to Version
  Curriculum.belongsToMany(Version, { through: CurriculumVersion, as: 'version' })
  Version.belongsToMany(Curriculum, { through: CurriculumVersion, as: 'curriculum' })
  
  // link Curriculum to each other to make a tree
  Curriculum.belongsTo(Curriculum, { foreignKey: 'parent' })
  Curriculum.hasMany(Curriculum, { foreignKey: 'parent' })

  // link Required to Version
  Required.belongsTo(Version, { as: 'ue' })
  Required.belongsTo(Version, { as: 'ue_needed' })

  // link Period to Version
  Period.belongsToMany(Version, { through: PeriodVersion })
  Version.belongsToMany(Period, { through: PeriodVersion })

  // link attributs to versions through attribut_version
  Attribut.belongsToMany(Version, { through: AttributVersion, as: 'version' })
  Version.belongsToMany(Attribut, { through: AttributVersion, as: 'attribut' })

  return {
    UE,
    Version,
    Curriculum,
    CurriculumVersion,
    Attribut,
    AttributVersion,
    Period,
    PeriodVersion,
    Degree,
    Required
  }
}
