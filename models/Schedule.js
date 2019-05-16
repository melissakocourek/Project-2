module.exports = function(sequelize, DataTypes) {
  var Schedule = sequelize.define("Schedule", {
    type: {
      type: DataTypes.STRING,
      // AllowNull is a flag that restricts a Schedule from being entered if it doesn't
      // have a text value
      allowNull: false
    },
    date: {
      type: DataTypes.STRING,
      // AllowNull is a flag that restricts a Schedule from being entered if it doesn't
      // have a text value
      allowNull: false,
      // len is a validation that checks that our Schedule is between 1 and 140 characters
      validate: {
        len: [1, 140]
      }
    },
    location: {
      type: DataTypes.STRING,
      // AllowNull is a flag that restricts a Schedule from being entered if it doesn't
      // have a text value
      allowNull: false,
      // len is a validation that checks that our Schedule is between 1 and 140 characters
      validate: {
        len: [1, 140]
      }
    }
  });
  return Schedule;
};
