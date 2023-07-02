// LIBRARIES
import { Response, Request } from 'express';
import jwt, {VerifyErrors} from 'jsonwebtoken';
import config from '../config.json';

// Secrets

const accessSecret = (config as Record<string, any>)[config.mode].jwt.access_secret;
const refreshSecret = (config as Record<string, any>)[config.mode].jwt.refresh_secret;

// UTILITIES

import Auth from '../utils/authentication';

const logout = async (req: Request, res: Response) => {


    if(req.cookies.refresh_token === undefined) {
        res.json({
            status: false,
            msg: 'refreshtokennotsent'
        });
        return;
    }
    if(req.cookies.access_token === undefined) {
        res.json({
            status: false,
            msg: 'accesstokennotsent'
        });
        return;
    }
    /**
     * We first need to make sure that token is valid token before inserting it to database.
     * We do not spam values stored to database. That is why these checks are done first before blacklisting. 
     */
    try {
        jwt.verify(req.cookies.refresh_token, refreshSecret);
        Auth.BlackListToken(req.cookies.refresh_token); // This will be called if token is not expired
    }
    catch(err : any) {
        // This will send error to client only if error is about something else than token expiring. 
        if(err.name !== 'TokenExpiredError') {
            res.json({
                status: false,
                msg: err
            });
            return;
        }
    }
    try {
        jwt.verify(req.cookies.access_token, accessSecret);
        Auth.BlackListToken(req.cookies.access_token); // This will be called if token is not expired
    }
    catch(err : any) {
        // This will send error to client only if error is about something else than token expiring. 
        if(err.name !== 'TokenExpiredError') {
            res.json({
                status: false,
                msg: err
            });
            return;
        }
    }
    res.setHeader('Set-Cookie', [
        'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
        'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly'
    ]);
    res.json({
        status: true,
        msg: 'logoutsuccess'
    });
}

export default {logout};