const nodemailer = require("nodemailer");

exports.handler = async function (event) {
  const data = JSON.parse(event.body);
  const name = data.name;
  const email = data.email;
  const telefon = data.telefon;
  const datum = data.datum;
  const uhrzeit = data.uhrzeit;
  const anzahl = data.anzahl_gaeste || "nicht angegeben";
  const nachricht = data.nachricht || "Keine Nachricht";

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
      subject: "Neue Reservierung über das Formular",
      text: \`
Neue Reservierung:

Name: \${name}
E-Mail: \${email}
Telefon: \${telefon}
Datum: \${datum}
Uhrzeit: \${uhrzeit}
Anzahl Gäste: \${anzahl}
Nachricht: \${nachricht}
\`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Reservierung erfolgreich gesendet." }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Fehler beim Senden: " + error.message }),
    };
  }
};
