/* eslint-disable no-undef */
const { all, markAsComplete, add, overdue, dueLater, dueToday } =
  require("../todo")();

describe("Test suite", () => {
  beforeEach(() => {
    all.length = 0;
  });

  test("creating a new todo", () => {
    const initialLength = all.length;

    add({
      title: "Test Todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });

    expect(all.length).toBe(initialLength + 1);

    const addedTodo = all[all.length - 1];
    expect(addedTodo.title).toBe("Test Todo");
    expect(addedTodo.completed).toBe(false);
    expect(addedTodo.dueDate).toBe(new Date().toISOString().slice(0, 10));
  });

  test("marking a todo as completed", () => {
    add({
      title: "Complete Me",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });

    const index = all.length - 1;

    markAsComplete(index);

    expect(all[index].completed).toBe(true);

    all.forEach((item, i) => {
      if (i !== index) {
        expect(item.completed).toBe(false);
      }
    });
  });

  test("retrieval of overdue items", () => {
    add({ title: "Overdue Todo", completed: false, dueDate: "2024-03-28" });

    const overdueItems = overdue();
    expect(overdueItems.length).toBe(1);
    expect(overdueItems[0].title).toBe("Overdue Todo");
  });

  test("retrieval of due today items", () => {
    const today = new Date().toISOString().slice(0, 10);
    add({ title: "Today Todo", completed: false, dueDate: today });

    const duetoday = dueToday();
    expect(duetoday.length).toBe(1);
    expect(duetoday[0].title).toBe("Today Todo");
  });

  test("retrieval of due later items", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().slice(0, 10);

    add({ title: "Due Later Todo", completed: false, dueDate: tomorrowDate });

    const duelater = dueLater();
    expect(duelater.length).toBe(1);
    expect(duelater[0].title).toBe("Due Later Todo");
  });
});
