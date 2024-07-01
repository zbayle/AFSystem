//V2.0.2
const sgMail = require('@sendgrid/mail'); 
const { fetchAllUsers } = require('./userController');
const { generateInventoryReport } = require('../services/InventoryReport.service'); // Import the generateInventoryReport function
const fs = require('fs');

exports.sendEmails = async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    const users = await fetchAllUsers(); // Fetch all users
    const developers = users.filter(user => user.role === 'Developer' || user.role === 'Admin'); // Filter out developers

    const report = await generateInventoryReport(); // Generate the inventory report

    // Prepare the email
    const msg = {
      from: 'zack@airfiber.cc', // Change to your verified sender
      subject: 'AirFiber Inventory Management System - New Feature Testing',
      text: 'If you are seeing this then you are viewing plain text. Upgrade to a modern email client to view the details of this emai.',
      html: report.htmlReport, // Use the HTML report as the email body
    };

    // Send an email to each developer
    for (const developer of developers) {
      msg.to = developer.email; // Set the recipient to the developer's email
    
      // Read the file and convert it to base64
      const fileContent = fs.readFileSync(report.excelFilePath).toString('base64');

      const date = new Date();
      const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    
      await sgMail.send({
        ...msg,
        attachments: [
          {
            content: fileContent,
            filename: `InventoryReport_${dateString}.xlsx`,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            disposition: 'attachment'
          }
        ]
      });
    }

    console.log('Emails sent');
    res.status(200).send('Emails sent');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending emails');
  }
};