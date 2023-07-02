import { Application } from 'express';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import config from './config.json';

/**
 *  Setups HTTP server
 *  @param app This is Express App that is passed to http.createServer method
 *  @param port Defines that which port server is opened. Can be set in config.json
 *  @returns {void}
 *  
 */
const HTTP = (app: Application, port: number) : void => {
    const server: http.Server = http.createServer(app);
    server.listen(port, (config as Record<string, any>)[config.mode].host);
    server.on('listening', () => {
        console.log('HTTP server is running on port ' + port);
    });
}
/**
 * Setups HTTPS server.
 * @param app This is Express App that is passed to https.createServer method
 * @param port Defines that which port server is opened. Can be set in config.json
 * @returns {void}
 */
const HTTPS = (app: Application, port: number) : void => {
    if(!fs.existsSync(__dirname + '/keys/server.key')) {
        console.error('[ERROR] Private key file not found');
        return;
    }
    if(!fs.existsSync(__dirname + '/keys/server.crt')) {
        console.error('[ERROR] Certificate file not found');
        return;
    }
    const key: Buffer = fs.readFileSync(__dirname + '/keys/server.key');
    const cert: Buffer = fs.readFileSync(__dirname + '/keys/server.crt');
    const server: https.Server = https.createServer({
        key: key,
        cert: cert
    }, app);
    server.listen(port, (config as Record<string, any>)[config.mode].host);
    server.on('listening', () => {
        console.log('HTTPS Server is running on port ' + port);
    });
    server.on('error', (err) => {
        console.log(err);
    });
}

export default { HTTP, HTTPS };