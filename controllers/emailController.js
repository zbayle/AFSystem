const nodemailer = require('nodemailer');
const { fetchAllUsers } = require('./userController');

// Define your email transporter
let transporter = nodemailer.createTransport({
  host: 'smpt.mail.airfiber.cc',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmails = async (req, res) => {
    // Fetch all users from your database
    const users = await fetchAllUsers();
  
    // Create an array to store all the sendMail promises
    let sendEmailPromises = [];
  
    // Loop through the users and send them an email if they are an admin
    for (let user of users) {
      if (user.role === 'Admin') {
        let mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Email Subject',
          text: 'Email Body'
        };
  
        // Add the sendMail promise to the array
        sendEmailPromises.push(new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Error sending email: ", error);
              reject(error);
            } else {
              console.log("Email sent: ", info.response);
              resolve(info.response);
            }
          });
        }));
      }
    }
  
    // Wait for all the sendMail promises to resolve
    Promise.all(sendEmailPromises)
      .then((results) => {
        // All emails have been sent successfully
        res.json({ message: 'Emails sent', results });
      })
      .catch((error) => {
        // An error occurred while sending the emails
        res.status(500).json({ message: 'Error sending emails', error });
      });
  };