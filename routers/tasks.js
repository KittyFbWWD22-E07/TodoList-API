import express from 'express';
import { addNewTask, deleteTask, getTaskListById, updateTask } from '../controllers/tasks.js';
import {validator} from '../middlewares/validator.js';
import { taskValidation } from '../validation/task.js';

const router = express.Router();

router.route('/:userId')
    .get(getTaskListById)

router.route('/')
    .post(validator(taskValidation),addNewTask)

  router.route('/:taskId')
    .put(updateTask)
    .delete(deleteTask)

export default router;