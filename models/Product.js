// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
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
    product_name: {
      // String.
      type: DataTypes.STRING,
      // Doesn't allow null values.
      allowNull: false
    },
    price: {
      // Decimal.
      type: DataTypes.DECIMAL,
      // Doesn't allow null values.
      allowNull: false,
      // Validates that the value is a decimal.
      validate: {
        isDecimal: true
      }
    },
    stock: {
      // Integer.
      type: DataTypes.INTEGER,
      // Doesn't allow null values.
      allowNull: false,
      // Set a default value of 10.
      defaultValue: 10,
      // Validates that the value is numeric.
      validate: {
        isNumeric: true
      }
    },
    category_id: {
      // Integer.
      type: DataTypes.INTEGER,
      // References the `Category` model's `id`.
      references: {
        model: 'category',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
