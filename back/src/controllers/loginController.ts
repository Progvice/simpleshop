// LIBRARIES
import { Response, Request } from 'express';
import mongoose, { Schema, Model } from 'mongoose';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

// UTILS
import auth from '../utils/authentication';

// CONFIG
import config from '../config.json';
// DB CONNECTION MODULE
import connect from '../db.connect';
connect.MongoDB();
// USER MODEL 
import UserModel from '../models/User';
const User : Model<any> = mongoose.model('user', UserModel);

const login = async (req: Request, res: Response) => {
    const requiredFields : string[] = ['email', 'password'];
    let allFieldsAreSet : boolean = true;
    let errorField : string = '';
    for(const field in requiredFields) {
        if(req.body[requiredFields[field]] === undefined || req.body[requiredFields[field]] === '') {
            allFieldsAreSet = false;
            errorField = requiredFields[field];
            break;
        }
    }
    if(!allFieldsAreSet) {
        res.json({
            status: false,
            msg: 'fieldnotset',
            field: errorField
        });
        return;
    }

    const userDetails = await User.findOne({
        email: req.body.email
    });
    // If user does not exist we just tell that wrong email or password. This is to prevent brute forcing accounts.


    if(userDetails === null) {
        res.json({
            status: false,
            msg: 'emailorpasswordwrong'
        });
        return;
    }
    const timeBetween : number = Math.floor(Date.now() / 1000) - userDetails.loginattempts[0].timestamp;
    if(userDetails.loginattempts[0].counter > 4) {
        // If enough time has not passed it will just increase attempts and reset timer to 30 minutes
        if(timeBetween < 1800) {
            userDetails.loginattempts[0].counter += 1;
            userDetails.loginattempts[0].timestamp = Math.floor(Date.now() / 1000);
            userDetails.save();
            res.json({
                status: false,
                msg: 'toomanyloginattempts'
            });
            // Returning at this point prevents reset of counter and timestamp.
            return;
        }
        // This code will reset counter back to 0 and set current timestamp. It resets if over 30 minutes has passed.
        userDetails.loginattempts[0].counter = 0;
        userDetails.loginattempts[0].timestamp = Math.floor(Date.now() / 1000);
        userDetails.save();
    }
    // We want to call Argon2 at this point because we can prevent unnecessary CPU usage by checking loginattempts before verifying password.
    const verify = await argon2.verify(userDetails.password, req.body.password);
    // If login failed then users loginattempts will increase and timestamp sets to current server time.
    if(!verify) {
        res.json({
            status: false,
            msg: "emailorpasswordwrong"
        });
        userDetails.loginattempts[0].counter += 1;
        userDetails.loginattempts[0].timestamp = Math.floor(Date.now() / 1000);
        userDetails.save();
        return;
    }
    // If verify passes then we will start creating JWT and send it to user as response


    const refreshToken = await auth.CreateRefreshToken(userDetails.email);
    const accessToken = await auth.CreateAccessToken(refreshToken);
    
    if('status' in accessToken) {
        if(!accessToken.status) {
            res.json({
                status: false,
                msg: accessToken
            });
        }
    }
    let aToken : string = '';
    if('token' in accessToken) {
        if(typeof(accessToken.token) === 'string') {
            aToken = accessToken.token;
        }
    }
    if(aToken === '') {
        res.json({
            status: false,
            msg: 'tokendatatypeinvalid'
        });
        return;
    }
    const accessSecret = (config as Record<string, any>)[config.mode].jwt.access_secret;
    console.log(jwt.verify(aToken, accessSecret));
    
    res.json({
        status: true,
        msg: 'loginsuccess',
        atoken: aToken,
        rtoken : refreshToken,
        rtokenTime: 60 * 60 * 24 * 7,
        atokenTime: 30 * 60
    });
}

export default { login };