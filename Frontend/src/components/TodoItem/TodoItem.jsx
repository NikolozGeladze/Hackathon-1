import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './TodoItem.css';
import { FaTrash } from "react-icons/fa6";
import { FaRegPenToSquare } from "react-icons/fa6";

export default function TodoItem({ todoItem, deleteTodoItem, startEditing, editTodoItem }) {
    const [checked, setChecked] = useState(todoItem.completed);

    const handleToggle = () => {
        const newValue = !checked;
        setChecked(newValue);
        editTodoItem(todoItem.id, { completed: newValue });
    };
    return (
        <>
            <motion.li className='item' layout initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <div className="checkbox-title">
                    <label>
                        <input type="checkbox" checked={checked} onChange={handleToggle} />
                    </label>
                    <motion.p
                        className={`${checked ? 'checkbox-checked' : ''}`}
                        layout
                        animate={{ opacity: checked ? 0.6 : 1, x: checked ? 10 : 0, }} transition={{ duration: 0.4 }}
                    >{todoItem.title}
                    </motion.p>
                </div>

                <div className="date">
                    <p>{todoItem.date}</p>
                </div>

                <div className="action-btn-div">
                    <button className='action-btn delete-btn' onClick={() => deleteTodoItem(todoItem.id)}>
                        <FaTrash />
                    </button>
                    <button className='action-btn edit-btn' onClick={() => startEditing(todoItem)}>
                        <FaRegPenToSquare />
                    </button>
                </div>
            </motion.li>
        </>
    );
}
