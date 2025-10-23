import React from 'react';
import TodoItem from '../TodoItem/TodoItem';
import './TodoList.css';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';


export default function TodoList({ todos, deleteTodoItem, startEditing, editTodoItem }) {
  return (
    <ul>
      <AnimatePresence mode="popLayout">
        {todos.map((todoItem, i) => (
          <TodoItem
            key={i}
            todoItem={todoItem}
            deleteTodoItem={deleteTodoItem}
            startEditing={startEditing}
            editTodoItem={editTodoItem}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
