import React, { useState } from 'react';
import './TodoForm.css';
import TodoList from '../TodoList/TodoList';
import { FaPlus } from "react-icons/fa6";
import { motion } from 'framer-motion';

export default function TodoForm({ data, addTodoItem, deleteTodoItem, editTodoItem }) {
    const [newTodo, setNewTodo] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (editingId) {
            editTodoItem(editingId, { title: newTodo });
            setEditingId(null);
        } else {
            addTodoItem(newTodo);
        }

        setNewTodo('');
    }

    function startEditing(todo) {
        setEditingId(todo.id);
        setNewTodo(todo.title);
    }

    const filteredTodos = data.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div className="todo-list-div">
            <h1>Todo App</h1>
            <div className="search-div">
                <input type="text" className='todo-list-input' placeholder="Search Todos" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="form-error">
                <form onSubmit={handleSubmit} className="add-todo-item-form">
                    <input
                        type="text"
                        placeholder="Add Your New Todo"
                        className='todo-list-input'
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                    />
                    <button type="submit">
                        <FaPlus />
                    </button>
                </form>
            </div>
            <TodoList
                todos={filteredTodos}
                deleteTodoItem={deleteTodoItem}
                startEditing={startEditing}
                editTodoItem={editTodoItem}
            />
        </motion.div>
    );
}
