import mongoose, { Schema } from 'mongoose';

const TokenBlacklist = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
},
{ collection: 'TokenBlacklist'}
);

TokenBlacklist.index(
    {createdAt: 1},
    {expireAfterSeconds: 7*24*60*60}
);

export default TokenBlacklist;