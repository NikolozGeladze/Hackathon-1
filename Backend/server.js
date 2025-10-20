import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import chalk from 'chalk';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import Joi from 'joi';
import 'dayjs/locale/ka.js';
dayjs.locale('ka');

const app = express();
const PORT = process.env.PORT;

//! ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'todos.json');

//! ---------------------- GET ALL TODOS ----------------------
app.get('/api/todos', async (req, res) => {
    try {
        const todosRaw = await fs.readFile(filePath, 'utf8');
        const todos = todosRaw ? JSON.parse(todosRaw) : [];
        console.log(chalk.green('200 → Success'));
        res.status(200).json(todos);
    } catch (err) {
        console.log(chalk.red.bold('500 → Server Error:', err.message));
        res.status(500).json({ message: '500 → Server Error' });
    }
});

//! ---------------------- CREATE TODO ----------------------
app.post('/api/todos', async (req, res) => {
    try {
        const todosRaw = await fs.readFile(filePath, 'utf8');
        const todos = todosRaw ? JSON.parse(todosRaw) : [];
        const uuid = uuidv4();

        if (!req.body.title) {
            console.log(chalk.red.bold('400 → Bad Request: Title Is Required'));
            return res.status(400).json({ message: 'Title is required' });
        }

        const now = dayjs();

        const userSchema = Joi.object({
            title: Joi.string().min(3).max(30).required(),
        });

        const newTodo = {
            id: uuid,
            title: req.body.title,
            completed: req.body.completed || false,
            date: now.format('DD.MM.YYYY, HH:mm'),
        };
        const { error } = userSchema.validate({ title: req.body.title });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        todos.push(newTodo);
        await fs.writeFile(filePath, JSON.stringify(todos, null, 2));
        console.log(chalk.green('201 → Todo Created'));
        res.status(201).json({ message: 'Todo successfully added', todo: newTodo });
    } catch (err) {
        console.log(chalk.red.bold('500 → Server Error:', err.message));
        res.status(500).json({ message: '500 → Server Error' });
    }
});

//! ---------------------- DELETE TODO ----------------------
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const todosRaw = await fs.readFile(filePath, 'utf8');
        let todos = todosRaw ? JSON.parse(todosRaw) : [];

        const id = req.params.id;
        if (!todos.some(todo => todo.id === id)) {
            console.log(chalk.red.bold('404 → Todo Not Found'));
            return res.status(404).json({ message: '404 → Todo Not Found' });
        }

        todos = todos.filter(todo => todo.id !== id);
        await fs.writeFile(filePath, JSON.stringify(todos, null, 2));

        console.log(chalk.green('200 → Success'));
        res.status(200).json({ message: '200 → Success', id });
    } catch (err) {
        console.log(chalk.red.bold('500 → Server Error:', err.message));
        res.status(500).json({ message: '500 → Server Error' });
    }
});

//! ---------------------- EDIT / TOGGLE TODO ----------------------
app.put('/api/todos/:id', async (req, res) => {
    try {
        const todosRaw = await fs.readFile(filePath, 'utf8');
        let todos = todosRaw ? JSON.parse(todosRaw) : [];

        const id = req.params.id;
        const { title, completed } = req.body;

        // Find the todo
        const todoIndex = todos.findIndex(todo => todo.id === id);
        if (todoIndex === -1) {
            console.log(chalk.red.bold('404 → Todo Not Found'));
            return res.status(404).json({ message: 'Todo not found' });
        }

        const userSchema = Joi.object({
            title: Joi.string().min(3).max(30).required(),
        });

        // Validate title if provided
        if (title !== undefined) {
            const { error, value } = userSchema.validate({ title });
            if (error) {
                console.log(chalk.red.bold('400 → Validation Error:', error.details[0].message));
                return res.status(400).json({ message: error.details[0].message });
            }
            todos[todoIndex].title = value.title; // validated value
        }

        // Toggle completed if provided
        if (req.body.hasOwnProperty('completed')) {
            todos[todoIndex].completed = !todos[todoIndex].completed;
        }

        await fs.writeFile(filePath, JSON.stringify(todos, null, 2));
        console.log(chalk.green('200 → Todo Updated Successfully'));
        res.status(200).json({ message: 'Todo updated successfully', todo: todos[todoIndex] });

    } catch (err) {
        console.log(chalk.red.bold('500 → Server Error:', err.message));
        res.status(500).json({ message: '500 → Server Error' });
    }
});


//! ---------------------- START SERVER ----------------------
app.listen(PORT, () => {
    console.log(chalk.blue(`Server running at http://localhost:${PORT}`));
});