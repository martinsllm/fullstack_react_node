const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: "587",
    auth: {
        user: process.env.APP_MAILER_USER,
        pass: process.env.APP_MAILER_PASSWORD
    }
});

module.exports = transport;