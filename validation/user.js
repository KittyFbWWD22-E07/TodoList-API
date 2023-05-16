import {body} from 'express-validator';
import {User} from '../models/user.js';
export const isEmailinUse = async (email) => {
    const user = await User.findOne({email});
    if (user) {
        return Promise.reject('Email already in use');
    }
}




export const userValidation = [
    body('fullname').trim().escape().notEmpty().withMessage('Fullname is required').matches(/^[a-zA-Z\s]+$/).withMessage('Please provide a valid fullname'),
    body('email').trim().escape().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email').custom(isEmailinUse).normalizeEmail(),
    body('password').trim().escape().notEmpty().withMessage('Password is required').matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!$?-_#])[a-zA-Z0-9!$?-_#]{8,}$/).withMessage('Your password should ONLY contain letters, numbers, and special characters($!?:_). It should be at least 8 characters long.')]

export const loginValidation = [
    body('email').trim().escape().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').trim().escape().notEmpty().withMessage('Password is required').matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!$?-_#])[a-zA-Z0-9!$?-_#]{8,}$/).withMessage('Your password should ONLY contain letters, numbers, and special characters($!?:_). It should be at least 8 characters long.')]