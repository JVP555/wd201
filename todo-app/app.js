const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const { Sequelize } = require("sequelize");
const methodOverride = require("method-override"); // ✅ add this line

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // ✅ and this line
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

// Home route - renders categorized todos
app.get("/", async (request, response) => {
  try {
    const overdue = await Todo.overdue();
    const dueToday = await Todo.dueToday();
    const dueLater = await Todo.dueLater();

    if (request.accepts("html")) {
      response.render("index", { overdue, dueToday, dueLater });
    } else {
      response.json({
        overdue,
        dueToday,
        dueLater,
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).send("Something went wrong");
  }
});

// Create new todo (form or API)
app.post("/todos", async function (request, response) {
  try {
    const { title, dueDate } = request.body;
    const todo = await Todo.addTodo({ title, dueDate });

    if (request.accepts("html")) {
      return response.redirect("/");
    } else {
      return response.json(todo);
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

// API routes

app.get("/todos", async function (request, response) {
  try {
    const todos = await Todo.findAll();
    return response.json(todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    const updatedTodo = await todo.markAsCompleted();
    if (request.accepts("html")) {
      return response.redirect("/");
    } else {
      return response.json(updatedTodo);
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  try {
    const deleted = await Todo.destroy({
      where: {
        id: request.params.id,
      },
    });

    if (request.accepts("html")) {
      return response.redirect("/");
    } else {
      return response.json(deleted ? true : false);
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
