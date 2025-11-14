import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import chalk from 'chalk';
import cors from 'cors';
import dayjs from 'dayjs';
import Joi from 'joi';
import 'dayjs/locale/ka.js';
dayjs.locale('ka');

//! ---------------- CONNECT TO DATABASE ----------------
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(chalk.green('Connected to MongoDB'));
    } catch (err) {
        console.log(chalk.red.bold('Failed to connect to MongoDB:', err.message));
    }
}

connectDB();

//! ---------------- TODO MODEL ----------------
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    date: { type: String, required: true },
});


const Todo = mongoose.model('Todo', todoSchema);

//! ---------------- MIDDLEWARE ----------------
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//! ---------------------- GET ALL TODOS ----------------------
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find()
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
        if (!req.body.title || req.body.title.trim() === '') {
            return res.status(400).json({ message: 'Title is required' });
        }

        const now = dayjs();
        const userSchema = Joi.object({
            title: Joi.string().min(3).max(30).required(),
        });

        const { error } = userSchema.validate({ title: req.body.title });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const newTodo = new Todo({
            title: req.body.title,
            completed: false,
            date: now.format('DD.MM.YYYY, HH:mm'),
        });

        await newTodo.save();
        res.status(201).json({ message: 'Todo successfully added', todo: newTodo });
    } catch (err) {
        console.log('500 → Server Error:', err.message);
        res.status(500).json({ message: '500 → Server Error' });
    }
});


//! ---------------------- DELETE TODO ----------------------
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: '404 → Todo Not Found' });
        }
        await Todo.findByIdAndDelete(id);
        res.status(200).json({ message: 'Todo successfully deleted' });
    } catch (err) {
        console.log('500 → Server Error:', err.message);
        res.status(500).json({ message: '500 → Server Error' });
    }
});

//! ---------------------- EDIT TODO ----------------------
app.put('/api/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;    
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: '404 → Todo Not Found' });
        }

        const { title } = req.body;

        if (title !== undefined) {
            const userSchema = Joi.object({
                title: Joi.string().min(3).max(30).required(),
            });
            const { error, value } = userSchema.validate({ title });
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            todo.title = value.title;
        }

        if (req.body.hasOwnProperty('completed')) {
            todo.completed = req.body.completed;
        }

        await todo.save();

        res.status(200).json({ message: 'Todo updated successfully', todo });
    }
    catch (err) {
        console.log('500 → Server Error:', err.message);
        res.status(500).json({ message: '500 → Server Error' });
    }
});

//! ---------------------- START SERVER ----------------------
app.listen(PORT, () => {
    console.log(chalk.blue(`Server running at http://localhost:${PORT}`));
});