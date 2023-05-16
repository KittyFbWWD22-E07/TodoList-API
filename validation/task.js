import {body} from "express-validator";

export const taskValidation = [
    body('title')
        .trim()
        .escape()
        .notEmpty().withMessage('Title is required'),
    body('description')
        .trim()
        .escape()
        .notEmpty().withMessage('Description is required'),
    body('status')
        .trim()
        .escape()
        .isIn('pending', 'inProgress', 'completed').withMessage('Status is required'),
    body('user')
        .trim()
        .escape()
        .isMongoId().withMessage('Please provide a valid ObjectId for user'),
    body('date')
        .trim()
        .escape()
        .isDate().withMessage('Date is required'),
    body('deadline')
        .trim()
        .escape()
        .isDate().withMessage('Deadline is required')
];
