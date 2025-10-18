import dotenv from 'dotenv';
dotenv.config();
import chalk from 'chalk';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import Joi from 'joi';
import 'dayjs/locale/ka.js';
dayjs.locale('ka');

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
        const { error, value } = userSchema.validate({ title: req.body.title });
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