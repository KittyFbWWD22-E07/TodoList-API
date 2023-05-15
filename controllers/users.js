import { User } from "../models/user.js";
import createError from "http-errors";
import { createToken } from "../utils/jwt.js";

// GET users 
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: 'GET users succesfully', 'users': users });
    } catch (error) {
        next(error);
    }
};

// POST user/signup   
export const signUp = async (req, res, next) => {
    try {
        const { fullname, email, password, role } = req.body;
        //  if (req.validationErrors.length) {
        //    return res.status(400).json({ message: 'Validation errors', errors: req.validationErrors
        const newUser = await User.create({ fullname, email, password, role });
        newUser.password = undefined;
        // Create token
        const token = await createToken({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET);

        // User succesfully created 
        res.status(201).json({ message: 'User created succesfully', 'user': newUser });
    } catch (error) {
        next(error)
    }
}

// POST user/login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw createError(401, 'User not registered');
        }
        // check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw createError(401, 'Invalid credentials');
        }
        if (!user && !isMatch) {
            throw createError(400, 'Login failed, invalid credentials');
        }
        // generate token
        // const token = await user.generateToken();
        res.status(200).json({ message: 'User logged in succesfully', 'user': user });
    } catch (error) {
        next(error);
    }
}

// 
