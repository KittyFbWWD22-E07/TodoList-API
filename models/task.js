import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        required: true,
        enum: ['pending',
            'inProgress',
            'completed'],
        type: String,
        default: 'pending',

    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    deadline: {
        type: Date,
    }
});

export const Task = model('Task', taskSchema);