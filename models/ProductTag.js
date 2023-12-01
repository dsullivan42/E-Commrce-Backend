const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

// Initialize ProductTag model (table) by extending off Sequelize's Model class
class ProductTag extends Model {}

// set up fields and rules for ProductTag model
ProductTag.init(
  {
    // define columns
    id : {
      // Integer.
      type : DataTypes.INTEGER,
      // Doesn't allow null values.
      allowNull : false,
      // Set as primary key.
      primaryKey : true,
      // Uses auto increment.
      autoIncrement : true
    },
    product_id : {
      // Integer.
      type : DataTypes.INTEGER,
      // References the `Product` model's `id`.
      references : {
        model : 'product',
        key : 'id'
      }
    },
    tag_id : {
      // Integer.
      type : DataTypes.INTEGER,
      // References the `Tag` model's `id`.
      references : {
        model : 'tag',
        key : 'id'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
