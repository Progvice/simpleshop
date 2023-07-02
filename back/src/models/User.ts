import mongoose, { Schema } from 'mongoose';
import LoginAttempts from './Loginattempts';
/**
 * User schema
 * @constructor User
 */
const User = new Schema({
    email: {
        type: String,
        required: [true, 'emailrequired'],
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: [true, 'passwordrequired']
    },
    firstname: {
        type: String,
        required: [true, 'firstnamerequired']
    },
    lastname: {
        type: String,
        required: [true, 'lastnamerequired']
    },
    phonenumber: {
        type: String,
        required: [true, 'phonenumberrequired']
    },
    loginattempts: {
        type: [LoginAttempts]
    },
    permgroup: {
        type: String
    }
});

export default User;