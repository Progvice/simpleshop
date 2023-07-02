import mongoose, { Query, Model, Document } from 'mongoose';
import argon2 from 'argon2';
import config from '../config.json';
import { Request, Response } from 'express';

import connect from '../db.connect';

connect.MongoDB();

import UserModel from '../models/User';
const User : Model<any> = mongoose.model('user', UserModel);

/**
 * Function for creating new user. It does check bunch of things and if all the requirements are met
 * then user is added to database
 * 
 * @param req Express Request object
 * @param res Express.js Response object
 * @returns {void}
 */
const listProducts = async (req: Request, res: Response) => {
    
}
const readProduct = async (req: Request, res: Response) => {
    
}

export default {readProduct};