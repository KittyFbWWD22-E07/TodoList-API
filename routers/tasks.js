import express from 'express';
import { addNewTask, deleteTask, getTaskListById, updateTask } from '../controllers/tasks.js';
import {validator} from '../middlewares/validator.js';
import { taskValidation } from '../validation/task.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.route('/:userId')
    .get(protect(), getTaskListById)

router.route('/')
    .post(protect(), validator(taskValidation),addNewTask)

  router.route('/:taskId')
    .put(protect(), authorize('user'), updateTask)
    .delete(protect(), deleteTask)

export default router;