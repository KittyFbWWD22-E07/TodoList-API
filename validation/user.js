import { body } from "express-validator";
import { User } from "../models/user.js";
export const isEmailinUse = async (email) => {
    const user = await User.findOne({ email });
    if (user) {
        return Promise.reject("Email already in use");
    }
};

export const userValidation = [
    body("fullname")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Fullname is required")
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage("Please provide a valid fullname"),
    body("email")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email")
        .custom(isEmailinUse)
        .normalizeEmail(),
    body("password")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Password is required")
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+-?]).{8,}$/
        )
        .withMessage(
            "Your password should contain at least one Capital letter, one small letter, one number, and one special character. It should be at least 8 characters long."
        ),
];

export const loginValidation = [
    body("email")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    body("password")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Password is required")
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+-?]).{8,}$/
        )
        .withMessage(
            "Your password should contain at least one Capital letter, one small letter, one number, and one special character. It should be at least 8 characters long."
        ),
];
