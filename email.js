import { db } from './firebase-config.js'; // Assuming you have exported db from firebase-config.js

// Function to fetch user emails from Firebase
function fetchUserEmails() {
  return db.ref('users').once('value')
    .then((snapshot) => {
      const users = snapshot.val();
      const userEmails = [];
      for (let userId in users) {
        if (users.hasOwnProperty(userId)) {
          userEmails.push(users[userId].email);
        }
      }
      return userEmails;
    })
    .catch((error) => {
      console.error('Error fetching user emails:', error);
      return [];
    });
}
// Initialize EmailJS
(function(){
  emailjs.init("YOUR_EMAILJS_USER_ID");
})();

// Function to send email using EmailJS
function sendEmail(templateParams) {
  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
    .then((response) => {
      console.log('Email sent successfully', response.status, response.text);
    }, (error) => {
      console.error('Error sending email', error);
    });
}
// email.js

import { auth, db } from './firebase-config.js'; // Assuming you have exported auth and db from firebase-config.js

// Function to fetch the current user's email from Firebase
function fetchCurrentUserEmail() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const userId = user.uid;
  return db.ref('users/' + userId).once('value')
    .then((snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.email) {
        return userData.email;
      } else {
        throw new Error('User email not found');
      }
    })
    .catch((error) => {
      console.error('Error fetching user email:', error);
      throw error; // Propagate the error further
    });
}

// Function to send email using EmailJS
function sendEmail(toEmail, templateParams) {
  templateParams.to_email = toEmail; // Assign the recipient email to templateParams

  emailjs.send("service_vn4re6h", "template_yz27ay9", templateParams)
    .then((response) => {
      console.log('Email sent successfully:', response);
      // Optionally handle success UI or logic
    }, (error) => {
      console.error('Error sending email:', error);
      // Optionally handle error UI or logic
    });
}

// Example usage:
const templateParams = {
  subject: 'Your OTP for Login', // Customize the subject as needed
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Your OTP for Login</title>
    </head>
    <body>
        <p>Dear User,</p>
        <p>Your OTP for login is: <strong>{{otp}}</strong></p>
        <p>Please use this OTP to complete your login process.</p>
        <p>Thank you!</p>
    </body>
    </html>
  `
};

// Fetch current user email and send email
fetchCurrentUserEmail()
  .then((userEmail) => {
    sendEmail(userEmail, templateParams); // Send email to the current user's email
  })
  .catch((error) => {
    console.error('Failed to send email:', error);
  });

export { sendEmail };
