"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {}

    static addTodo({ title, dueDate }) {
      return this.create({ title, dueDate, completed: false });
    }

    static getTodos() {
      return this.findAll();
    }

    static async overdue() {
      const { Op } = require("sequelize");
      return this.findAll({
        where: {
          dueDate: { [Op.lt]: new Date().toISOString().split("T")[0] },
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueToday() {
      return this.findAll({
        where: {
          dueDate: new Date().toISOString().split("T")[0],
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueLater() {
      const { Op } = require("sequelize");
      return this.findAll({
        where: {
          dueDate: { [Op.gt]: new Date().toISOString().split("T")[0] },
        },
        order: [["dueDate", "ASC"]],
      });
    }

    markAsCompleted() {
      return this.update({ completed: true });
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );

  return Todo;
};
