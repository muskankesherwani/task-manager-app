const express = require("express");
const Task = require("../models/task");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();


// CREATE TASK
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, category, dueDate, priority } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const task = await Task.create({
            title,
            description,
            category,
            dueDate,
            priority,
            user: req.userId
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        console.error("Create task error:", error.message);

        res.status(500).json({
            message: "Server error while creating task"
        });
    }
});


// GET ALL MY TASKS
router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            tasks
        });

    } catch (error) {
        console.error("Get tasks error:", error.message);

        res.status(500).json({
            message: "Server error while fetching tasks"
        });
    }
});



/*
// UPDATE TASK
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, description, category, dueDate, completed } = req.body;

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId
            },
            {
                title,
                description,
                category,
                dueDate,
                completed
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        console.error("Update task error:", error.message);

        res.status(500).json({
            message: "Server error while updating task"
        });
    }
});
*/



// UPDATE TASK
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            dueDate,
            completed,
            priority
        } = req.body;

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId
            },
            {
                title,
                description,
                category,
                dueDate,
                completed,
                priority
            },
            {
            //    new: true,
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        console.error("Update task error:", error.message);

        res.status(500).json({
            message: "Server error while updating task"
        });
    }
});




// MARK TASK COMPLETE
router.patch("/:id/complete", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId
            },
            {
                completed: true
            },
            {
                new: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task marked as completed",
            task
        });

    } catch (error) {
        console.error("Complete task error:", error.message);

        res.status(500).json({
            message: "Server error while completing task"
        });
    }
});


// DELETE TASK
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.error("Delete task error:", error.message);

        res.status(500).json({
            message: "Server error while deleting task"
        });
    }
});


module.exports = router;