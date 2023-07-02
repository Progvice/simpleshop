// ESSENTIALS
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import config from './config.json';
import cors from 'cors';
// This is where server will be started up
import server from './server';

// Express App creation
const app = express();

// Express middlewares
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000'
}));

// ROUTES
import indexRouter from './routes/index';
import productsRouter from './routes/products';
import categoriesRouter from './routes/categories';
import usersRouter from './routes/users';
import permissionsRouter from './routes/permissions';
import loginRouter from './routes/login';
import logoutRouter from './routes/logout';
import adminRouter from './routes/admin';

app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/users', usersRouter);
app.use('/permissions', permissionsRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/admin', adminRouter);

/*
 *  I used Record here because for some odd reason Typescript would not allow use of config[config.mode].protocol
 *  I also tried implementing interface to config, but it still did not work in that way.
 * 
 *  Now instead of interface I use Record<string, any> to make it work like we want it to work. 
 *  Type checking at switch statement is not really necessary as it defaults to error if protocols type is not string
 *  and value http or https.
 *
 */

switch((config as Record<string, any>)[config.mode].protocol) {
    case 'http':
        server.HTTP(app, (config as Record<string, any>)[config.mode].port);
    break;
    case 'https':
        server.HTTPS(app, (config as Record<string, any>)[config.mode].port);
    break;
    default:
        console.error('[ERROR] Invalid protocol set. Please check config.json');
    break;
}

