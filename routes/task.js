const express = require('express');
const router = express.Router();
const {Project} = require('../models');
const {Task} = require('../models');
const {User} = require('../models');
const { check, validationResult } = require('express-validator');


router.post('/projects//:projectId', [
    check('title').notEmpty().withMessage('Title is required').trim(),
    check('description').optional().trim(),
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const projectId = req.params.projectId;
    try {
        const { title, description } = req.body;
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        const task = await Task.create({ title, description });
        await project.addTask(task);
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating task.' });
    }
});

router.get('/projects/:projectId/tasks', async (req, res) => {
    const projectId = req.params.projectId;
    try {
        const project = await Project.findByPk(projectId, { include: Task });
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        const tasks = project.Tasks;
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching tasks.' });
    }
});


router.get('/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching task.' });
    }
});


router.put('/:id', async (req, res) => {
    const taskId = req.params.id;
    const { title, description, status, priority } = req.body;
    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        task.title = title;
        task.description = description;
        task.status = status;
        task.priority = priority;
        await task.save();
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating task.' });
    }
});


router.delete('/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        await task.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting task.' });
    }
});


router.get('/getByPriority/:priority', async (req, res) => {
    const priority = req.params.priority;
    try {
        const tasks = await Task.findAll({ where: { priority } });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching tasks by priority.' });
    }
});


router.put('/:id/priority', async (req, res) => {
    const taskId = req.params.id;
    const { priority } = req.body;
    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        task.priority = priority;
        await task.save();
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating task priority.' });
    }
});

router.put('/:id/status', async (req, res) => {
    const taskId = req.params.id;
    const { status } = req.body;
    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        task.status = status;
        await task.save();
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating task status.' });
    }
});


router.put('/:taskId/assign/:userId', async (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.params.userId;

    try {
        const task = await Task.findByPk(taskId);
        const user = await User.findByPk(userId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        task.UserId = user.id;
        await task.save();

        res.json({ message: 'Task assigned to user.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error assigning task to user.' });
    }
});


router.get('/assigned-to/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findByPk(userId, {
            include: Task,
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const assignedTasks = user.Tasks || [];

        res.json(assignedTasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching tasks assigned to user.' });
    }
});

module.exports = router;