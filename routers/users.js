import express from 'express';
import { deleteUser, getAllUsers, login, signUp, updateUser } from '../controllers/users.js';

const router = express.Router();

// Signup
router.route('/signup')
    .post(signUp);

// Signin
router.route('/login')
    .post(login);

// get all users
router.route('/')
    .get(getAllUsers);

// update user
router.route('/:id')
    .put(updateUser);

// delete user
router.route('/:id')
    .delete(deleteUser);

export default router;