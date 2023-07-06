import mongoose, { Query, Model, Document } from 'mongoose';
import argon2 from 'argon2';
import config from '../../config.json';
import { Request, Response } from 'express';

import connect from '../../db.connect';

connect.MongoDB();

import CategoryModel from '../../models/Category';
const Category : Model<any> = mongoose.model('category', CategoryModel);

/**
 * Function for creating new user. It does check bunch of things and if all the requirements are met
 * then user is added to database
 * 
 * @param req Express Request object
 * @param res Express.js Response object
 * @returns {void}
 */
const readProduct = async (req: Request, res: Response) => {}
const addProduct = async (req: Request, res: Response) => {
    
}
export default {readProduct};