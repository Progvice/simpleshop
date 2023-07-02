import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import config from '../config.json';

(config as Record<string, any>)[config.mode].jwt.access_secret = uuidv4();
(config as Record<string, any>)[config.mode].jwt.refresh_secret = uuidv4();
const json = JSON.stringify(config, null, 4);

const writing = fs.writeFileSync(__dirname + '/../config.json', json);
console.log(writing);


