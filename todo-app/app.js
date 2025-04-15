const express = require("express");
var csrf = require("csurf");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const path = require("path");
const { Sequelize } = require("sequelize");
const methodOverride = require("method-override");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser("shh secret"));
app.use(csrf({ cookie: true }));
app.set("view engine", "ejs");

// Home route - renders categorized todos
app.get("/", async (request, response) => {
  try {
    const overdue = await Todo.overdue();
    const dueToday = await Todo.dueToday();
    const dueLater = await Todo.dueLater();
    const completedTodo = await Todo.completedTodo();

    if (request.accepts("html")) {
      response.render("index", {
        overdue,
        dueToday,
        dueLater,
        completedTodo,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        overdue,
        dueToday,
        dueLater,
        completedTodo,
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

app.put("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    if (!todo) {
      return response.status(404).send("Todo not found");
    }

    const updatedTodo = await todo.setCompletionStatus(request.body.completed);

    if (request.accepts("html")) {
      return response.redirect("/");
    } else {
      return response.json(updatedTodo);
    }
  } catch (error) {
    console.error(error);
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
