import express from 'express';
import { db } from '../db/setup.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all tasks for current user
router.get('/', async (req, res) => {
  try {
    const tasks = await db('tasks')
      .where({ user_id: req.user.id })
      .orderBy('datetime', 'desc');
    
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single task
router.get('/:id', async (req, res) => {
  try {
    const task = await db('tasks')
      .where({ 
        id: req.params.id,
        user_id: req.user.id 
      })
      .first();
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { datetime, note } = req.body;
    
    // Validation
    if (!datetime || !note) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Create task
    const [taskId] = await db('tasks').insert({
      user_id: req.user.id,
      datetime,
      note
    });
    
    const newTask = await db('tasks').where({ id: taskId }).first();
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { datetime, note } = req.body;
    
    // Validation
    if (!datetime || !note) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if task exists and belongs to user
    const task = await db('tasks')
      .where({ 
        id: req.params.id,
        user_id: req.user.id 
      })
      .first();
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Update task
    await db('tasks')
      .where({ id: req.params.id })
      .update({
        datetime,
        note,
        updated_at: db.fn.now()
      });
    
    const updatedTask = await db('tasks').where({ id: req.params.id }).first();
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    // Check if task exists and belongs to user
    const task = await db('tasks')
      .where({ 
        id: req.params.id,
        user_id: req.user.id 
      })
      .first();
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Delete task
    await db('tasks').where({ id: req.params.id }).delete();
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;