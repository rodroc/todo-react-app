import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import axios from 'axios';

function TaskFormPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);
  
  const fetchTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3001/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTask(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading task...</div>;
  }
  
  if (id && error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="task-form-page">
      <h1>{id ? 'Edit Task' : 'Create New Task'}</h1>
      <TaskForm task={task} isEditing={!!id} />
    </div>
  );
}

export default TaskFormPage;