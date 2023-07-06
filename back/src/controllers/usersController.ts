import mongoose, { Query, Model, Document } from 'mongoose';
import argon2 from 'argon2';
import config from '../config.json';
import { Request, Response } from 'express';

import connect from '../db.connect';
// MongoDB connect
connect.MongoDB();

// MODELS
import UserModel from '../models/User';
const User : Model<any> = mongoose.model('user', UserModel);

// UTILS
import Auth from '../utils/authentication';

/**
 * Function for creating new user. It does check bunch of things and if all the requirements are met
 * then user is added to database
 * 
 * @param req Express Request object
 * @param res Express.js Response object
 * @returns {void}
 */
const createUser = async (req: Request, res: Response) => {
    // Here are all the required fields that are required to create new user
    const requiredFields : string[] = [
        'email',
        'emailagain',
        'password',
        'passwordagain',
        'firstname',
        'lastname'
    ];
    // We assume that all fields are set
    let allFieldsAreSet : boolean = true;
    let errorField : string = '';
    // We will loop through all these fields and check if req.body has all those fields set
    for(const field in requiredFields) {
        if(req.body[requiredFields[field]] === undefined) {
            allFieldsAreSet = false;
            errorField = requiredFields[field];
            break;
        }
    }
    // If even one required field was not set then we will send this information to frontend and end this request.
    if(!allFieldsAreSet) {
        res.json({
            status: false,
            msg: 'fieldnotset',
            field: errorField
        });
        return;
    }
    // We want to check that users email is correctly written.
    if(req.body.email !== req.body.emailagain) {
        res.json({
            status: false,
            msg: 'emailsdonotmatch'
        });
        return;
    }
    // Here we are trying to find already existing user with same email. We do not want any duplicates
    const checkIfUserExists : any = await User.findOne({
        email: req.body.email
    });
    if(checkIfUserExists !== null) {
        // If email is in use prevent user from registering with it
        res.json({
            status: true,
            msg: 'emailused',
        });
        return;
    }
    
    interface UserIF {
        email: string;
        emailagain: string;
        password: string;
        passwordagain: string;
        firstname: string;
        lastname: string;
        phonenumber: string;
    };
    const u : UserIF = req.body;
    const newUser = new User({
        email: u.email,
        password: 'temporaryvaluebeforeargon2', // Here we just set some value because we want to prevent unnecessary CPU usage
        firstname: u.firstname,
        lastname: u.lastname,
        phonenumber: u.phonenumber,
        loginattempts: [
            {
                counter: 0,
                timestamp: Math.floor(Date.now() / 1000)
            }
        ],
        permgroup: 'default'
    });
    let result : any;
    try {
        result = await newUser.save();
    }
    catch(err) {
        console.log(err);
        res.json({
            status: false,
            msg: ''
        });
        return;
    }
    if(result !== null) {
        // We call Argon function here because now we have confirmation that user is properly added to database
        // This way we can prevent unnecessary CPU and RAM usage 
        const uPassword = await argon2.hash(req.body.password,
            {
                memoryCost: (config as Record<string, any>)[config.mode].argon.memoryCost ** (config as Record<string, any>)[config.mode].argon.memoryCostPower,
                timeCost: (config as Record<string, any>)[config.mode].argon.timeCost,
                hashLength: (config as Record<string, any>)[config.mode].argon.hashLength
            }
        );
        // Update hashed password to users details
        const passwordUpdate : any = await User.findOneAndUpdate(
            { _id: result._id },
            { $set: {password: uPassword }},
            { new: true }
        );
        // Tell frontend that user was created succesfully
        res.json({
            status: true,
            msg: 'usercreated',
            data: passwordUpdate
        });
        return;
    }
    res.json({
        status: false,
        msg: 'Unknown error'
    });
}
const readUser = (req: Request, res: Response) => {
    res.send({
        status: true,
        msg: 'User ID is ' + req.params.id
    });
}
const updateUser = () => {}
const deleteUser = () => {}

const authUser = async (req: Request, res: Response) => {
    const checkToken = await Auth.Run(req);
    if(!checkToken.status) {
        res.json({
            status: false,
            msg: checkToken.msg
        });
        return;
    }
    if('token' in checkToken) {
        res.set('token', checkToken.token);
        res.json({
            status: true,
            msg: checkToken.msg
        });
    }
}
export default { readUser, updateUser, deleteUser, createUser, authUser };