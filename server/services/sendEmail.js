import nodemailer from 'nodemailer';
import fs from 'fs';
import {promisify} from 'util';
import 'dotenv/config.js'

const readFileAsync = promisify(fs.readFile);

export async function sendEmail(path,recipient,username) {
    // Read the HTML template and image file
    const htmlTemplate = await readFileAsync(path, 'utf-8');
    // const imageAttachment = await readFileAsync('path/to/your/image.png');

    const updatedhtmlTemplate = htmlTemplate.replace('[Recipient]',username)

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
        html: updatedhtmlTemplate,
        // attachments: [{
        //     filename: 'image.png',
        //     content: imageAttachment,
        //     encoding: 'base64',
        //     cid: 'uniqueImageCID', // Referenced in the HTML template
        // }],
    });

    console.log('Email sent:', info.messageId);
}