// Beispiel für Formular-Submit
fetch('/.netlify/functions/sendMail', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Max Mustermann',
    email: 'max@example.com',
    telefon: '0123456789',
    datum: '2025-06-01',
    uhrzeit: '19:00',
    anzahl_gaeste: '4',
    nachricht: 'Bitte am Fenster'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Erfolg:', data);
})
.catch(err => {
  console.error('Fehler:', err);
});
