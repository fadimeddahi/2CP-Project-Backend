const nodemailer = require('nodemailer');
const sendEmail = require('./emailSender.js');

// Configuration (à mettre dans .env)
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Ou autre service (Mailgun, SendGrid)
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

module.exports = async ({ email, subject, message }) => {
  const mailOptions = {
    from: 'AthelX <no-reply@athelx.com>',
    to: email,
    subject,
    text: message
    // html: `<p>${message}</p>` // Version HTML optionnelle
  };

  await transporter.sendMail(mailOptions);
};