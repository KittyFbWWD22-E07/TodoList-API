import {Task} from '../models/task.js';
import createError from 'http-errors';

// GET /tasks
export const getTaskListById = async (req, res, next) => {
    try {
        const {userId} = req.params;
        const taskList = await Task.findById(userId);

        if(!taskList){
            throw createError(404, "No task assigned to this user");
        }
        res.status(200).json({
            message: "Task list by id",
            taskList
        })
        }catch (error) {
        next(error);
    }
}

// POST /tasks
export const addNewTask = async (req, res, next) => {
    try {
        const {title, description, status, user, date, deadline} = req.body;
        const newTask = await Task.create({title, description, status, user, date, deadline});

        res.status(200).json({
            message: "New task added",
            newTask
        })
    } catch (error) {
        next(error);
    }
}

// PUT /tasks/:taskId
export const updateTask = async (req, res, next) => {
    try {
        const {taskId} = req.params;
        const {title, description, status, user, date, deadline} = req.body;
        const task = await Task.findById(taskId);

        if(!task){
            return createError(404, "Task with this id does not exist");
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.user = user || task.user;
        task.date = date || task.date;
        task.deadline = deadline || task.deadline;

        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task
        })
    } catch (error) {
        next(error);
    }
}

// DELETE /tasks/:taskId
export const deleteTask = async (req, res, next) => {
    try {
        const {taskId} = req.params;
        const task = await Task.findById(taskId);

        if(!task){
            throw createError(404, "Task with this id does not exist");
        }

        const deletedTask = await Task.findByIdAndRemove(taskId);

        res.status(200).json({
            message: "Task with given id is deleted successfully",
            task: deletedTask
        })
    } catch (error) {
        next(error);
    }
}