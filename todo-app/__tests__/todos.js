/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
function extractCsrfToken(res) {
  const $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

let server, agent;

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });
  //creating todo test
  test("Creates a new todo", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "add todo",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  //updating

  // marking as complete
  test("Marks a todo as complete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Mark as complete",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");

    const parsedGroupedTodosResponse = JSON.parse(groupedTodosResponse.text);
    const latestTodo =
      parsedGroupedTodosResponse.dueToday[
        parsedGroupedTodosResponse.dueToday.length - 1
      ];
    const todoId = latestTodo.id;

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent
      .put(`/todos/${todoId}`)
      .set("Accept", "application/json")
      .send({
        completed: true,
        _csrf: csrfToken,
      });

    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });
  //marking incomplete
  test("Marks a todo as incomplete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Mark as incomplete",
      dueDate: new Date().toISOString(),
      completed: true,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");

    const parsedGroupedTodosResponse = JSON.parse(groupedTodosResponse.text);
    const latestTodo =
      parsedGroupedTodosResponse.dueToday[
        parsedGroupedTodosResponse.dueToday.length - 1
      ];
    const todoId = latestTodo.id;

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const markinCompleteResponse = await agent
      .put(`/todos/${todoId}`)
      .set("Accept", "application/json")
      .send({
        completed: false,
        _csrf: csrfToken,
      });

    const parsedUpdateResponse = JSON.parse(markinCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(false);
  });

  //deleteing a todo
  test("Deletes a todo", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "to Deletecomplete",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");

    const parsedGroupedTodosResponse = JSON.parse(groupedTodosResponse.text);
    const latestTodo =
      parsedGroupedTodosResponse.dueToday[
        parsedGroupedTodosResponse.dueToday.length - 1
      ];
    const todoId = latestTodo.id;

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const deleteResponse = await agent
      .delete(`/todos/${todoId}`)
      .set("Accept", "application/json")
      .send({
        _csrf: csrfToken,
      });

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual(true);

    const deletedTodo = await db.Todo.findByPk(todoId);
    expect(deletedTodo).toBeNull();
  });
});
