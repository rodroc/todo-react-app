import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import axios from 'axios';

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };
  
  const formatDateTime = (datetimeStr) => {
    const date = new Date(datetimeStr);
    return date.toLocaleString();
  };
  
  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }
  
  return (
    <div className="task-list-page">
      <div className="task-header">
        <h1>My Tasks</h1>
        <Link to="/tasks/new">
          <Button className="add-task-btn">+ Add New Task</Button>
        </Link>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks found. Create a new task to get started!</p>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <div key={task.id} className="task-item">
              <div className="task-content">
                <h3 className="task-date">{formatDateTime(task.datetime)}</h3>
                <p className="task-note">{task.note}</p>
              </div>
              <div className="task-actions">
                <Link to={`/tasks/${task.id}`} className="edit-link">Edit</Link>
                <button 
                  className="delete-link" 
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskListPage;