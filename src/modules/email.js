require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

let send = async (req, _res, data) => {
    let host = req.protocol + "://" + req.get("host");

    const message = {
        to: data.email,
        from: "AuroDocs <contact@arweb.dev>",
        subject: "Document Edit Invite - AuroDocs",
        text: `Invite link: ${host}/accept?docid=${data.docid}&user=${data.user}`,
        html: `Invite link: <a href="${host}/accept?docid=${data.docid}&user=${data.user}">Accept Invite</a>`,
    };

    try {
        await sgMail.send(message);
        console.log(`=> Sent invite to: ${data.email}! 💌`);
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body);
        }
    }
};

module.exports = { send };
