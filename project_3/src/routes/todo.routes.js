import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all todos
router.get('/', (req, res) => {
    const getToDos = db.prepare('SELECT * FROM todos WHERE user_id = ?');
    const todos = getToDos.all(req.userId);

    if (!todos) {
        return res.status(404).json({ error: "No ToDos assigned to you" });
    }
    res.status(200).json(todos);
});

// create a todo
router.post('/', (req, res) => {
    const { task } = req.body;
    const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES(?, ?)`);
    const results = insertTodo.run(req.userId, task);

    res.status(201).json({ id: results.lastInsertRowid, task, completed: 0 });
});

// update a todo
router.put('/:id', (req, res) => {
    const { completed } = req.body;
    const { id } = req.params;

    const updatedTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?'); // Update syntax of SQLite
    updatedTodo.run(completed, id);
    res.status(200).json({ message: "Todo Completed" });
});

// delete a todo
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    const deleteToDo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`);
    deleteToDo.run(id, userId);
    res.status(200).json({ message: "ToDo deleted Successfully" });
});

export default router;