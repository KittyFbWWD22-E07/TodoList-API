import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    fullname: {
        type: String,
        required: [true, 'Please provide your fullname'],
        matches: [/^[a-zA-Z\s]+$/, 'Please provide a valid fullname'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        matches: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        matches: [/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+-?]).{8,}$/, 'Your password should contain at least one Capital letter, one small letter, one number, and one special character. It should be at least 8 characters long.'],
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    updated_At: {
        type: Date,
        default: Date.now(),
    },

    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
    }
});

// hash password before saving
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }

        // generate salt
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(this.password, salt);

        // re-assign hashed password
        this.password = hashedPassword;

        // re-assign updated_At
        this.updated_At = Date.now();

        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

export const User = model('User', userSchema);
