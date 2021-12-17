require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
    to: "aggesoft@gmail.com",
    from: "AuroDocs <contact@arweb.dev>",
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

/* const msg = {
    to: "aggesoft@gmail.com",
    from: "AuroDocs <contact@arweb.dev>",
    subject: 'Hello world',
    text: 'Hello plain world!',
    html: '<p>Hello HTML world!</p>',
    templateId: process.env.SENDGRID_EMAIL_ID,
    dynamic_template_data: {
        invite: 'https://arweb.dev',
    },
}; */

let send = async (req, res) => {
    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body);
        }
    }    
}

module.exports = { send }
