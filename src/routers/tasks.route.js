const express = require('express');
const Task = require('../models/task.model');
const router = new express.Router();
const auth = require('../middleware/auth.middleware');

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e)
    }
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// skipping means how many documents are needed to be skipped and limit means after skipping how many to show now
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const options = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.limit) {
        options.limit = parseInt(req.query.limit);
    }

    if (req.query.skip) {
        options.skip = parseInt(req.query.skip);
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        options.sort = {}
        options.sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        const tasks = await Task.find({
            ...match,
            owner: req.user._id
        }, null, options);

        // or
        // await req.user.populate({
        //    path: 'tasks',
        //    match
        // }).execPopulate();
        // res.send(req.user.tasks);
        res.send(tasks);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            res.send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedKeys = ['description', 'completed'];
    const updatedKeys = Object.keys(req.body);
    const isValidOperation = updatedKeys.every(update => allowedKeys.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: new Error('Invalid Operation') });
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            res.status(404).send();
        }

        updatedKeys.forEach(update => task[update] = req.body[update]);
        await task.save()

        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = exports = router;