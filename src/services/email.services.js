require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});



// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistionEmail(userEmail,name){
    const subject = "Welcome to Backend_Ledger!";

    const text= `Hello ${name},\n\nThank You for Registering at Backend-Ledger, We're excited to have you on board !\n\nBest regards,\nThe Backend-Ledger Team`;

    const html = `<p>Hello ${name},</p><p>Thank You for Registering at Backend-Ledger. We're excited to have you on board !</p><p>Best regards,<br>The Backend-Ledger Team</p>`;
    await sendEmail(userEmail,subject,text,html)
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Successful - Piggy Bank";

    const text = `Hello ${name},

Your transaction of ₹${amount} to account ${toAccount} has been successfully completed.

Transaction Status: Successful

Thank you for using Piggy Bank.

Regards,
Piggy Bank
Secure Banking Services`;

   const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;">

        <h2 style="margin-bottom: 20px;">Transaction Successful</h2>

        <p>Hello ${name},</p>

        <p>
            Your transaction of <strong>₹${amount}</strong> to account
            <strong>${toAccount}</strong> has been successfully completed.
        </p>

        <div style="padding: 15px; margin: 20px 0; border: 1px solid #ddd;">
            <p style="margin: 0;">
                <strong>Transaction Status:</strong> Successful
            </p>
        </div>

        <p>
            Thank you for using Piggy Bank. We appreciate your trust in our
            banking services.
        </p>

        <p style="margin-top: 30px;">
            Regards,<br>
            <strong>Piggy Bank</strong><br>
            Secure Banking Services
        </p>

    </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmailFail(userEmail,name,ammount,toAccount){
  const subject = "Transaction Failed";

  const text = `Hello ${name},

We’re sorry to inform you that your transaction of ₹${amount} to account ${toAccount} could not be completed.

Transaction Status: Failed

No action is required from you at this time. Please verify the account details and try again. If the amount has been deducted from your account, please allow some time for the transaction to be reversed.

If you continue to experience issues, please contact our support team.

Regards,
Piggy Bank
Secure Banking Services`;

const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;">

    <h2 style="margin-bottom: 20px;">Transaction Failed</h2>

    <p>Hello ${name},</p>

    <p>
        We’re sorry to inform you that your transaction of
        <strong>₹${amount}</strong> to account
        <strong>${toAccount}</strong> could not be completed.
    </p>

    <div style="padding: 15px; margin: 20px 0; border: 1px solid #ddd;">
        <p style="margin: 0;">
            <strong>Transaction Status:</strong> Failed
        </p>
    </div>

    <p>
        Please verify the account details and try the transaction again.
        If the amount has been deducted from your account, please allow
        some time for the transaction to be reversed.
    </p>

    <p>
        If you continue to experience issues, please contact our support team.
    </p>

    <p style="margin-top: 30px;">
        Regards,<br>
        <strong>Piggy Bank</strong><br>
        Secure Banking Services
    </p>

</div>
`;

  await sendEmail(userEmail,subject,tect,html);

}


module.exports = {sendRegistionEmail, sendTransactionEmail,sendTransactionEmailFail}