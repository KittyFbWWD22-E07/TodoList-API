import express from 'express';
import { addNewTask, deleteTask, getTaskListById } from '../controllers/tasks.js';

const router = express.Router();

router.route('/:userId')
    .get(getTaskListById)

router.route('/')
    .post(addNewTask)

  router.route('/:taskId')
    .put(updateTask)
    .delete(deleteTask) 
    