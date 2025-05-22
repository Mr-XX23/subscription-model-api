import nodemailer from 'nodemailer';
import { EMAIL, EMAIL_PASSWORD } from './env.js';

export const accountEmail = EMAIL;

const trasporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : accountEmail,
        pass : EMAIL_PASSWORD
    }
});


export default trasporter;