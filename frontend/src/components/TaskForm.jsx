import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import axios from 'axios';

function TaskForm({ task, isEditing = false }) {
  const [datetime, setDatetime] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (task) {
      setDatetime(task.datetime || '');
      setNote(task.note || '');
    } else {
      // Set default datetime to current time
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 16);
      setDatetime(formattedDate);
    }
  }, [task]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const taskData = { datetime, note };
      
      if (isEditing && task?.id) {
        await axios.put(`http://localhost:3001/api/tasks/${task.id}`, taskData, config);
      } else {
        await axios.post('http://localhost:3001/api/tasks', taskData, config);
      }
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="datetime">Date and Time</label>
        <input
          type="datetime-local"
          id="datetime"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="note">Note</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows="5"
          required
        />
      </div>
      
      <div className="form-actions">
        <Button type="button" className="cancel-btn" onClick={() => navigate('/')}>
          Cancel
        </Button>
        <Button type="submit" className="submit-btn" disabled={loading}>
          {isEditing ? 'Update Task' : 'Save Task'}
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;