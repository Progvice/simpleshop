import config from './config.json';
import mongoose from 'mongoose';

/**
 * Connects to MongoDB. 
 * @returns {void}
 */
const MongoDB = () : void => {
    const host : string = (config as Record<string, any>)[config.mode].db.mongodb.host;
    const username : string = (config as Record<string, any>)[config.mode].db.mongodb.username;
    const password : string = (config as Record<string, any>)[config.mode].db.mongodb.password;
    const db : string = (config as Record<string, any>)[config.mode].db.mongodb.db;
    mongoose.connect(
        `mongodb+srv://${username}:${password}@${host}/${db}?retryWrites=true&w=majority&ssl=true`,
        {}
    );
}
// WIP. Will be added if needed
const MySQL = () => {}
export default { MongoDB, MySQL }