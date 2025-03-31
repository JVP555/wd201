/* eslint-disable no-undef */
const todoList = require("../todo");
const { all, markAsComplete, add, overdue, dueLater, dueToday } = todoList();

describe("Test suite", () => {
  beforeAll(() => {
    add({
      title: "new",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
  });

  test("creating a new todo", () => {
    add({
      title: "new todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    const l = all.length;
    expect(all[l - 1].title).toBe("new todo");
  });

  test("marking a todo as completed", () => {
    const l = all.length;
    markAsComplete(l - 1);
    expect(all[l - 1].completed).toBe(true);
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
      const itemDate = new Date(item.dueDate);
      const todayDate = new Date(today);
      expect(itemDate).toEqual(todayDate);
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
