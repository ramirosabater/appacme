const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',

    auth: {
        user: 'notificaciones@acme.com.ar',
        pass: 'vtbp kbkk btnw hepn'
    }
}));

module.exports = {
    transporter
}