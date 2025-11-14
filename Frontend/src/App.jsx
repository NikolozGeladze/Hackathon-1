import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TodoForm from './components/TodoForm/TodoForm';
import { toast } from 'react-toastify';

function App() {
  const [data, setData] = useState([]);

  async function getTodoItems() {
    const response = await axios.get('http://localhost:5000/api/todos');
    setData(response.data);
  }

  async function addTodoItem(title) {
    if (!title) {
      toast.error('Title is required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/todos', {
        title,
        completed: false
      });
      toast.success(response.data.message);
      getTodoItems();
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Something went wrong');
      }
    }
  }

  async function deleteTodoItem(id) {
    toast.promise(
      axios.delete(`http://localhost:5000/api/todos/${id}`),
      {
        pending: 'Pending . . .',
        success: 'Item Successfully Deleted',
        error: 'Item Not Deleted',
      }
    ).then(() => getTodoItems())
  }

  async function editTodoItem(id, updatedData) {
    try {
      const response = await axios.put(`http://localhost:5000/api/todos/${id}`, updatedData)
      toast.success(response.data.message);
      getTodoItems();
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Something went wrong');
      }
    }
  }

  useEffect(() => {
    getTodoItems();
  }, []);

  return (
    <>
      <div className="container">
        <TodoForm data={data} addTodoItem={addTodoItem} deleteTodoItem={deleteTodoItem} editTodoItem={editTodoItem} />
      </div>
    </>
  );
}

export default App;
