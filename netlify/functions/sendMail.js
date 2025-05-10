
const nodemailer = require("nodemailer");

exports.handler = async function (event) {
  const data = new URLSearchParams(event.body);
  const name = data.get("name");
  const email = data.get("email");
  const telefon = data.get("telefon");
  const datum = data.get("datum");
  const uhrzeit = data.get("uhrzeit");
  const nachricht = data.get("nachricht");

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

Name: ${name}
E-Mail: ${email}
Telefon: ${telefon}
Datum: ${datum}
Uhrzeit: ${uhrzeit}
Nachricht: ${nachricht}
      `,
    });

    return {
      statusCode: 302,
      headers: {
        Location: "https://reservierung-dionysos.netlify.app/danke"
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Fehler beim Senden: " + error.message,
    };
  }
};
