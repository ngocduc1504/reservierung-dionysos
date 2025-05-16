
const nodemailer = require("nodemailer");

exports.handler = async function (event) {
  const data = JSON.parse(event.body);

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
      from: `"Reservierung" <${process.env.SMTP_USER}>`,
      to: "info@dionysos-gotha.de",
      subject: "Neue Reservierung über die Website",
      text: `
Neue Reservierung:

Name: ${data.name}
E-Mail: ${data.email}
Telefon: ${data.phone}
Datum: ${data.date}
Uhrzeit: ${data.time}
Gästeanzahl: ${data.guests}
Nachricht: ${data.message}
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "E-Mail wurde erfolgreich gesendet." }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Fehler beim Senden: " + error.message }),
    };
  }
};
