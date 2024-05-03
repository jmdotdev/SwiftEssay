import nodemailer from 'nodemailer';
import path  from 'path';
import ejs from 'ejs';
import { dirname } from 'path';
import 'dotenv/config.js'
import { fileURLToPath } from 'url';
import fs from 'fs/promises'; 

// const readFileAsync = promisify(fs.readFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export async function sendEmail(recipient,username) {

   try {
    const htmlTemplatePath = `./emailTemplates/welcome.ejs`;
    const htmlTemplate = await fs.readFile(htmlTemplatePath, 'utf-8');
    const renderedHTML = ejs.render(htmlTemplate, { username });
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSKEY,
        },
    });

    // Send email
    const info = await transporter.sendMail({
        from: process.env.EMAIL,
        to: recipient,
        subject: 'Welcome To Swift Essay',
        html: renderedHTML,
    });

    console.log('Email sent:', info.messageId);
   } catch (error) {
    console.log("error sending email",error);
   }
}