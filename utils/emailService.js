const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASS,
  },
})

const sendEmail = async (email, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: html,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(info.response)
  } catch (error) {
    console.error(error)
  }
}

const sendSecretViaEmail = (email, secret) => {
  const html = `Ο κρυπτογραφημένος κωδικός μιας χρήσης είναι <b><h2>${secret.ciphered}</h2></b> και 
  έχει υποστεί κρυπτογράφηση μέσω Caesar Cipher με βήμα (shift) τον προσωπικό μονοψήφιο αριθμό που σας εκδόθηκε όταν επιβεβαιώσατε τον λογαριασμό σας. 
  Παρακαλούμε για την ολοκλήρωση της σύνδεσής σας να εισάγετε τον αρχικό αποκρυπτογραφημένο κωδικό.`
  sendEmail(email, 'Κωδικός Επαλήθευσης', html)
}

const sendShiftViaEmail = (email, shift) => {
  const html = `<h3>Ο μυστικός μονοψήφιος αριθμός αποκρυπτογράφησης σας είναι ο <h2><b>${shift}</b></h2></h3><br><p>Παρακαλώ να τον θυμάστε!</p>`
  sendEmail(email, 'Μυστικός αριθμός shift για αποκρυπτογράφηση', html)
}

const sendVerificationEmail = (email, token) => {
  const html = `<h1>Επιβεβαίωση λογαριασμού</h1><p>Παρακαλώ κάντε κλικ στον ακόλουθο σύνδεσμο για να επιβεβαιώσετε τον λογαριασμό σας:</p><a href="https://ergasia-client.surge.sh/verify/${token}">Επιβεβαίωση λογαριασμού</a>`
  sendEmail(email, 'Επιβεβαιώστε το email σας', html)
}

module.exports = {
  sendSecretViaEmail,
  sendVerificationEmail,
  sendShiftViaEmail,
}
