
const nodemailer = require("nodemailer");

exports.handler = async function (event) {
  const data = JSON.parse(event.body);
  const { name, email, phone, date, time, guests, message } = data;

  const transporter = nodemailer.createTransport({
    host: "smtp.strato.de",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: \`Reservierung <\${process.env.SMTP_USER}>\`,
      to: "info@dionysos-gotha.de",
      subject: "Neue Reservierung über die Website",
      text: \`
Neue Reservierung:

Name: \${name}
E-Mail: \${email}
Telefon: \${phone}
Datum: \${date}
Uhrzeit: \${time}
Anzahl der Gäste: \${guests}
Nachricht: \${message}
      \`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
