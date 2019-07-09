const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});


//this is the templating of the email, you could replace this with other templating schemes if you want
const createAnEmail = text => `
    <div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size 20px;
    ">
        <h2>Hello from the Heertens!</h2>
        <p>${text}</p>
        <p>Thanks!</p>
    </div>
`;

exports.transport = transport;
exports.createAnEmail = createAnEmail;