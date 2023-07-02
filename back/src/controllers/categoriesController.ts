import mongoose, { Query, Model, Document } from 'mongoose';
import argon2 from 'argon2';
import config from '../config.json';
import { Request, Response } from 'express';

import connect from '../db.connect';

connect.MongoDB();

import CategoryModel from '../models/Category';
const Category : Model<any> = mongoose.model('category', CategoryModel);

const listCategories = async (req: Request, res: Response) => {
    let allCategories : Query<any[], any> | boolean = false;
    try {
        const allCategories = await Category.find({});
    }
    catch(err) {
        res.json({
            status: false,
            msg: err
        });
        return;
    }
    res.json({
        status: true,
        data: allCategories
    });

}

export default {listCategories}