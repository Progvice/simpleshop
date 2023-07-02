import mongoose, { Query, Model, Document } from 'mongoose';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import config from '../../config.json';
import { Request, Response } from 'express';

import connect from '../../db.connect';

connect.MongoDB();

import CategoryModel from '../../models/Category';
const Category : Model<any> = mongoose.model('category', CategoryModel);

const accessSecret = (config as Record<string, any>)[config.mode].jwt.access_secret;

import Auth from '../../utils/authentication';

/**
 * This function adds new categorie 
 * 
 * @param req Express Request object
 * @param res Express.js Response object
 * @returns {void}
 */
const createCategory = async (req: Request, res: Response) => {

    const checkAuth = await Auth.CheckAuthAndPerm(req, res, 'create_categories');
    if(!checkAuth.status) {
        res.json({
            status: false,
            msg: checkAuth.msg
        });
        return;
    }
    const categoryName : string = req.body.name;
    let categoryUrl : string = categoryName.replace(/ /g, '-').toLowerCase();
    
    const checkCategoryUrl = await Category.findOne({
        category_url: categoryUrl
    });

    if(checkCategoryUrl !== null) {
        const timestamp = Math.floor(Date.now() / 1000);
        const lastFiveDigits = timestamp % 100000;
        categoryUrl = `${categoryUrl}${lastFiveDigits}`;
    }

    try {
        const newCategory = new Category({
            category_name: categoryName,
            category_url: categoryUrl,
            parent_category: null,
            sub_categories: []
        });
        newCategory.save();
    }
    catch(err) {
        console.log(err);
        res.json({
            status: false,
            msg: 'errorcreatingcategory',
            err: err
        });
        return;
    }
    res.json({
        status: true,
        msg: 'categorycreated'
    });
    
}
const readCategory = async (req: Request, res: Response) => {
    const checkAuth = await Auth.CheckAuthAndPerm(req, res, 'create_categories');
    if(!checkAuth.status) {
        res.json({
            status: false,
            msg: checkAuth.msg
        });
        return;
    }
    const allCategories = await Category.find({});
    res.json({
        status: true,
        data: allCategories
    });
}
const updateCategory = async (req: Request, res: Response) => {}
const removeCategory = async (req: Request, res: Response) => {}
export default {readCategory, createCategory};