/* eslint-disable no-undef */
const todoList = require("../todo");
const { all, markAsComplete, add, overdue, dueLater, dueToday } = todoList();

describe("Test suite", () => {
  beforeAll(() => {
    add({
      title: "Initial Todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
  });

  test("creating a new todo", () => {
    const initialLength = all.length;
    add({
      title: "New Todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });

    expect(all.length).toBe(initialLength + 1);
    const addedTodo = all[all.length - 1];
    expect(addedTodo.title).toBe("New Todo");
    expect(addedTodo.completed).toBe(false);
  });

  test("marking a todo as completed", () => {
    const initialLength = all.length;

    add({
      title: "Complete Me",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });

    markAsComplete(initialLength);
    expect(all[initialLength].completed).toBe(true);
  });

  test("retrieval of overdue items", () => {
    const overdueItems = overdue();
    const today = new Date().toISOString().slice(0, 10);

    overdueItems.forEach((item) => {
      const itemDate = new Date(item.dueDate);
      const todayDate = new Date(today);
      expect(itemDate).toBeLessThan(todayDate);
    });
  });

  test("retrieval of due today items", () => {
    const duetoday = dueToday();
    const today = new Date().toISOString().slice(0, 10);

    duetoday.forEach((item) => {
      expect(item.dueDate).toBe(today);
    });
  });

  test("retrieval of later items", () => {
    const duelater = dueLater();
    const today = new Date().toISOString().slice(0, 10);

    duelater.forEach((item) => {
      const itemDate = new Date(item.dueDate);
      const todayDate = new Date(today);
      expect(itemDate).toBeGreaterThan(todayDate);
    });
  });
});
