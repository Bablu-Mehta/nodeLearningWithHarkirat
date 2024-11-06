const express = require("express");
const bodyParser = require("body-parser");
const PORT = 3000;

const fs = require("fs");

const app = express();

app.use(bodyParser.json());

app.get("/todos", (req, res) => {
  let todos = JSON.parse(fs.readFileSync("todos.txt", "utf-8"));
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const { title, description } = req.body;

  const newTodo = {
    id: Math.floor(Math.random() * 100),
    title,
    description,
  };

  const previousData = JSON.parse(fs.readFileSync("todos.txt", "utf-8"));

  const jsonParsedPreviousData = JSON.parse(previousData);

  jsonParsedPreviousData.push(newTodo);

  fs.writeFileSync("todos.txt", JSON.stringify(jsonParsedPreviousData));

  res.status(201).json({ id: newTodo?.id });
});

app.get("/todos/:id", (req, res) => {
  const { id } = req.params;

  const todos = JSON.parse(fs.readFileSync("todos.txt", "utf-8"));

  const todoIndex = todos.findIndex((todo) => todo.id == id);

  if (todoIndex == -1) {
    return res.sendStatus(404);
  }

  res.send(todos[todoIndex]);
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const todos = JSON.parse(fs.readFileSync("todos.txt", "utf-8"));

  const todoIndex = todos.findIndex((todo) => todo.id == id);

  if (todoIndex == -1) {
    return res.sendStatus(404);
  }

  const updatedTodos = todos.map((todo) => {
    if (todo.id == id) {
      return {
        ...todo,
        title: title,
        description: description,
      };
    }
    return todo;
  });

  fs.writeFileSync("todos.txt", JSON.stringify(updatedTodos));

  res.status(200).send("updated successfully");
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;

  const todos = JSON.parse(fs.readFileSync("todos.txt", "utf-8"));

  const todoIndex = todos.findIndex((todo) => todo.id == id);

  if (todoIndex == -1) {
    return res.sendStatus(404);
  }

  const updatedTodos = todos.filter((todo) => todo.id != id);
  fs.writeFileSync("todos.txt", JSON.stringify(updatedTodos));

  res.status(200).send("deleted successfully");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
