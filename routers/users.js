import express from 'express';
import { deleteUser, getAllUsers, login, signUp, updateUser } from '../controllers/users.js';
import { loginValidation, userValidation } from '../validation/user.js';
import { authorize, protect } from '../middlewares/auth.js';

const router = express.Router();

// Signup
router.route('/signup')
    .post(validator(userValidation), signUp);

// Signin
router.route('/login')
    .post(validator(loginValidation),  login);

// get all users
router.route('/')
    .get(protect(), authorize('admin'), getAllUsers);

// update and delete user
router.route('/:id')
    .put(protect(),authorize('user') , updateUser)
    .delete(protect(), authorize('admin'), deleteUser);


    
export default router;