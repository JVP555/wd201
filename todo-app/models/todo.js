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
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueToday() {
      return this.findAll({
        where: {
          dueDate: new Date().toISOString().split("T")[0],
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueLater() {
      const { Op } = require("sequelize");
      return this.findAll({
        where: {
          dueDate: { [Op.gt]: new Date().toISOString().split("T")[0] },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async completedTodo() {
      return this.findAll({
        where: {
          completed: true,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    setCompletionStatus(completed) {
      return this.update({ completed });
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
