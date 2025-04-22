const { validationResult } = require('express-validator');
const db = require('../db/connection');

// Get all tasks for the current user
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await db('tasks')
      .where({ user_id: req.user.id })
      .orderBy('datetime', 'asc');

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Get a single task
exports.getTask = async (req, res) => {
  try {
    const task = await db('tasks')
      .where({ id: req.params.id, user_id: req.user.id })
      .first();

    if (!task) {
      return res.status(404).json({
        status: 'fail',
        message: 'Task not found'
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { datetime, note } = req.body;

  try {
    const [taskId] = await db('tasks').insert({
      user_id: req.user.id,
      datetime,
      note
    });

    const task = await db('tasks').where({ id: taskId }).first();

    res.status(201).json({
      status: 'success',
      data: task
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { datetime, note } = req.body;

  try {
    // Check if task exists and belongs to user
    const task = await db('tasks')
      .where({ id: req.params.id, user_id: req.user.id })
      .first();

    if (!task) {
      return res.status(404).json({
        status: 'fail',
        message: 'Task not found'
      });
    }

    // Update task
    await db('tasks')
      .where({ id: req.params.id })
      .update({
        datetime,
        note,
        updated_at: db.fn.now()
      });

    // Get updated task
    const updatedTask = await db('tasks').where({ id: req.params.id }).first();

    res.status(200).json({
      status: 'success',
      data: updatedTask
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    // Check if task exists and belongs to user
    const task = await db('tasks')
      .where({ id: req.params.id, user_id: req.user.id })
      .first();

    if (!task) {
      return res.status(404).json({
        status: 'fail',
        message: 'Task not found'
      });
    }

    // Delete task
    await db('tasks').where({ id: req.params.id }).del();

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};