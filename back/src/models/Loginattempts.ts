import mongoose, { Schema } from 'mongoose';

const LoginAttempts = new Schema({
    counter: {
        type: Number,
    },
    timestamp: {
        type: Number
    }
});

export default LoginAttempts;