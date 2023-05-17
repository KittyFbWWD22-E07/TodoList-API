import { User } from "../models/user.js";
import createError from "http-errors";
import { createToken } from "../utils/jwt.js";
import { taskValidation } from "../validation/task.js";
import { Task } from "../models/task.js";

const COOKIE_OPTIONS = {
    maxAge: 3_600_000 * 48,
    httpOnly: true,
    sameSite: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
}

// GET users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: 'GET users successfully', 'users': users });
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
        // Set cookies
        res.cookie('access_token', token, COOKIE_OPTIONS);
        // User successfully created
        res.status(201).json({ message: 'User created successfully', 'user': newUser });
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
        // Create token
        const token = await createToken({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        // Set cookies
        res.cookie('access_token', token, COOKIE_OPTIONS);
        // User successfully logged in
        res.status(200).json({ message: 'User logged in successfully', 'user': user });
    } catch (error) {
        next(error);
    }
}

// PUT user/:id
export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { fullname, email, password, role } = req.body;
        const user = await User.findById(id);
        if (!user) {
            throw createError(404, 'User not found');
        }
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.password = password || user.password;

        await user.save();

        user.password = undefined;

        res.status(200).json({ message: 'User updated successfully', 'user': user });
    } catch (error) {
        next(error);
    }
}

// DELETE user/:id
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            throw createError(404, 'User not found');
        }

        const deletedTasks = await Task.deleteMany({ user: user._id});
        const deletedUser = await User.findByIdAndRemove(id);
        res.status(200).json({ message: `${user.id} deleted successfully`, 'user': deletedUser });
    } catch (error) {
        next(error);
    }
}
