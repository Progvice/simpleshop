// LIBRARIES 
import jwt from 'jsonwebtoken';
import config from '../config.json';
import { v4 as uuidv4 } from 'uuid';
import mongoose, { Model } from 'mongoose';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

// INTERFACES

import AuthAndPerm from '../interfaces/AuthAndPerm';

// USER MODEL - User model is used to fetch user data that will be included to JWT (Not all of users data)
import UserModel from '../models/User';
const User : Model<any> = mongoose.model('user', UserModel);

// PERMISSION MODEL - Fetches permission group that has been set to user
import PermissionsModel from '../models/Permissions';
const Permissions : Model<any> = mongoose.model('permissions', PermissionsModel);

// TOKEN BLACKLIST MODEL - This model stores token to blacklist. 
import TokenBlackListModel from '../models/TokenBlacklist';
const TokenBlackList : Model<any> = mongoose.model('tokenblacklist', TokenBlackListModel);

// JWT SECRETS - Secret keys for generating access token and refresh token
const accessSecret = (config as Record<string, any>)[config.mode].jwt.access_secret;
const refreshSecret = (config as Record<string, any>)[config.mode].jwt.refresh_secret;
/**
 * 
 * @name CreateAccessToken
 * @description Creates new access token from refresh token. This function checks first that refresh token is valid before creating access token.
 * @param refresh_token 
 * @returns {Promise<string|object>} 
 */
const CreateAccessToken = async (refresh_token : string, additional_data : object = {}) : Promise<object> => {
    let verification;
    // Lets check that refresh token is not blacklisted. If it is then we return error message.
    const checkTokenBlackList : boolean = await CheckBlackList(refresh_token);
    if(checkTokenBlackList) {
        return {
            status: false,
            name: 'blacklistedtoken',
            token: 'refresh'
        };
    }
    try {
        verification = jwt.verify(refresh_token, refreshSecret);
        const userData = await User.findOne({
            email: verification.sub
        });
        const userPerms = await Permissions.findOne({
            name: userData.permgroup
        });
        const finalUserData = {
            email: userData.email,
            perms: userPerms,
            other: additional_data
        };
        const token = jwt.sign(finalUserData, accessSecret, {
            expiresIn: '30m'
        });
        return {
            status: true,
            token: token
        };
    }
    catch(err : any) {
        return {
            status: false,
            err: AccessTokenError(err),
        }
    }
}
/**
 * @name CheckAccessToken
 * @param access_token 
 * @description Simple function to check if access token is valid and not blacklisted. Returns true if token is valid.
 * @returns 
 */
const CheckAccessToken = async (access_token : string) : Promise<boolean> => {
    if(access_token.length < 1) {
        return false;
    }
    try {
        jwt.verify(access_token, accessSecret);
    }
    catch(err : any) {
        return false;
    }
    const blCheck = await CheckBlackList(access_token);
    if(blCheck) {
        return false;
    }
    return true;
}
/**
 * @name AccessTokenError
 * @param err 
 * @description This function just handles error. I added this function to make CreateAccessToken function easier to read.
 * @returns {object}
 */
const AccessTokenError = (err: Error) : object => {
    let errObj : object;
    switch(err.name) {
        case 'TokenExpiredError':
            errObj = {
                status: false,
                name: 'tokenexpired',
                token: 'refresh'
            };
        break;
        case 'JsonWebTokenError':
            errObj = {
                status: false,
                name: 'tokenerror',
                msg: err.message,
                token: 'refresh'
            };
        break;
        case 'NotBeforeError':
            errObj = {
                status: false,
                name: 'tokennotactivated',
                token: 'refresh'
            };
        break;
        default:
            errObj = {
                status: false,
                name: 'jwtunknownerror',
                token: 'refresh'
            };
        break;
    }
    return errObj;
}
/**
 * @name CreateRefreshToken
 * @description This is used to create new refresh token. This is basically token that maintains session
 * @param email Input users email here. This way you can create refresh token. This token can be used to create access token.
 * @returns {string}
 */
const CreateRefreshToken = async (email : string) : Promise<string> => {
    const userJwt = jwt.sign({
        iss: (config as Record<string, any>)[config.mode].host,
        sub: email,
        exp: Math.floor(Date.now() / 1000) + (60*60*24*7),
        nbf: Math.floor(Date.now() / 1000),
        iat: Math.floor(Date.now() / 1000),
        jti: uuidv4()
    },
    (config as Record<string, any>)[config.mode].jwt.refresh_secret
    );
    return userJwt;
}
/**
 * @name BlackListToken
 * @description You can blacklist token using this function. MongoDB and Mongoose handles TTL automatically. 
 * @param token Insert token that you want to blacklist
 * @returns 
 */
const BlackListToken = async (token : string) : Promise<string> => {
    // Token is hashed to pricavy of user is not compromised
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    try {
        const blAdd = new TokenBlackList({
            token: hashedToken
        });
        const result = await blAdd.save();
    }
    catch(err) {
        console.log(err);
    }
    return hashedToken;
}
/**
 * @name CheckBlackList
 * @description You can check if token is black listed or not. 
 * @param token Insert token here that you want to check. 
 * @returns {boolean} if true then it is blacklisted. If false then token is not blacklisted.
 */
const CheckBlackList = async(token : string) : Promise<boolean> => {
    // Tokens are hashed in blacklist. We need to produce hash of token.
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const blackListing = await TokenBlackList.findOne({
        token: hashedToken
    });
    if(blackListing === null) {
        return false;
    }
    return true;
}
/**
 * @name Run
 * @description This function sets new access token to cookie automatically. Developer can include this function to 
 * every request that requires authentication. This way developer does not have to write same code again and again
 * to every request that requires authentication. This function returns token back to developer. This is made so that
 * new access token can be created on the fly if it is expired. UX is better this way. 
 * 
 * @param req Express Req object. It will be used to get tokens from cookies.
 * @param res Express Res object. Will be used to set new cookies if needed.
 * @returns {Promise<AuthObject>} object always has "status" and "msg" properties in it.
 * 
 * @example
 * // Example 1: Access token is expired/invalid but refresh token is valid
 * import Auth from '../utils/authentication';
 * import { AuthObject } from '../interfaces/Auth';
 * const checkAuth : AuthObject = await Auth.Run(req, res);
 * console.log(checkAuth); // Output: {status: true, msg: 'tokenrenewed', token: [NEWTOKEN] };
 * 
 * // Example 2: Refresh token is expired/invalid
 * import Auth from '../utils/authentication';
 * import { AuthObject } from '../interfaces/Auth';
 * const checkAuth : AuthObject = await Auth.Run(req, res);
 * console.log(checkAuth); // Output: {status: false, msg: 'sessionexpired'};
 */

import { AuthObject } from '../interfaces/Auth';
const Run = async (req: Request) : Promise<AuthObject> => {
    // Check that HTTP request has refresh token included

    let access_token : any = req.headers['authorization'];
    const refresh_token : any = req.headers['x-refresh-token'];
    if(refresh_token === undefined) {
        return {
            status: false,
            msg: 'refreshtokennotsent'
        };
    }
    // Check that HTTP request has access token included
    if(access_token === undefined) {
        return {
            status: false,
            msg: 'accesstokennotsent'
        };
    }
    access_token = access_token.replace('Bearer ', '');
    const aTokenCheck = await CheckAccessToken(access_token);
    // If token is still valid then this function will just return at this point
    if(aTokenCheck) {
        return {
            status: true,
            msg: 'authsuccess',
            token: access_token
        };
    }
    // If token is expired/invalid then we will try to create new access token based on refresh token.

    const newAccessToken : object = await CreateAccessToken(refresh_token);

    if('status' in newAccessToken) {
        if(!newAccessToken.status) {
            return {
                status: false,
                msg: 'sessionexpired'
            };
        }
    }

    // Check that newAccessToken has these two properties. CreateAccessToken should always return both of these properties. Check to make sure that it does. 
    if('status' in newAccessToken && 'token' in newAccessToken) {
        // If status is true then it means that new token was created succesfully.
        if(typeof newAccessToken.token === 'string') {
            return {
                status: true,
                msg: 'tokenrenewed',
                token: newAccessToken.token
            };
        }
    }
    // If this unknown error pops up you should probably check that CreateAccessToken function returns proper values. 
    return {
        status: false,
        msg: 'unknownerror'
    };
}

/**
 * @name CheckPermission
 * @description This function checks permission of users access token.
 * @param permName 
 * @param token 
 * @returns {Promise<boolean>}
 */
const CheckPermission = async (permName : string, token: string) : Promise<boolean> => {
    let userData : string | jwt.JwtPayload | object;
    let permsBool : boolean = false;
    try {
        userData  = jwt.verify(token, accessSecret);
    }
    catch(err) {
        console.log('Error when checking access token');
        return permsBool;
    }
    if(typeof userData === 'object') {
        if('perms' in userData) {
            if(permName in userData.perms) {
                // Here we fetch permission from JWT
                permsBool = userData.perms[permName];
            }
        }
    }
    if(!permsBool) {
        return false;
    }
    return true;
}

/**
 * @name CheckAuthAndPerm
 * @description This function basically checks token from request and then checks if user has permission to do action
 * @param req 
 * @param perm 
 * @returns {Promise<AuthAndPerm>}
 */
const CheckAuthAndPerm = async (req: Request, res: Response, perm : string) : Promise<AuthAndPerm> => {
    const checkAuth = await Run(req);
    if(!checkAuth.status) {
        return {
            status: false,
            msg: 'unauthorizedaccess'
        };
    }
    if(checkAuth.token === undefined) {
        return {
            status: false,
            msg: 'invalidtoken'
        };
    }
    const permCheck : boolean = await CheckPermission(perm, checkAuth.token);
    if(!permCheck) {
        return {
            status: false,
            msg: 'unauthorizedaccess'
        };
    }
    // We set this so Nuxi server can set new cookie.
    res.set('token', checkAuth.token);
    return {
        status: true,
        msg: 'OK!'
    };
}

export default { 
    CreateAccessToken,
    CreateRefreshToken,
    BlackListToken,
    CheckBlackList,
    CheckAccessToken,
    Run,
    CheckPermission,
    CheckAuthAndPerm
}