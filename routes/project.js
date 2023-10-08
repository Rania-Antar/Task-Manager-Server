const express = require('express');
const router = express.Router();
//const Project = require('../models/Project');
const {Project} = require('../models');
const { validationResult, check } = require('express-validator');

router.post('/', [
    check('title').notEmpty().trim(),
    check('description').optional().trim(),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const { title, description } = req.body;
        const project = await Project.create({ title, description });
        res.status(201).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating project.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching projects.' });
    }
});

router.get('/:id', async (req, res) => {
    const projectId = req.params.id;
    try {
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching project.' });
    }
});

router.put('/:id', async (req, res) => {
    const projectId = req.params.id;
    const { title, description } = req.body;
    try {
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        project.title = title;
        project.description = description;
        await project.save();
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating project.' });
    }
});

router.delete('/:id', async (req, res) => {
    const projectId = req.params.id;
    try {
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        await project.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting project.' });
    }
});

module.exports = router;