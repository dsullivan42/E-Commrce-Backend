const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

// Initialize Category model (table) by extending off Sequelize's Model class
class Category extends Model {}

// set up fields and rules for Category model
Category.init(
  {
    // define columns
    id: {
      // Integer.
      type: DataTypes.INTEGER,
      // Doesn't allow null values.
      allowNull: false,
      // Set as primary key.
      primaryKey: true,
      // Uses auto increment.
      autoIncrement: true
    },
    category_name: {
      // String.
      type: DataTypes.STRING,
      // Doesn't allow null values.
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

module.exports = Category;
