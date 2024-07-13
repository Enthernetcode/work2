// Import necessary Firebase services and initialize Firebase app
import { auth, db } from './firebase-config.js'; // Assuming you have exported auth and db from firebase-config.js
import { sendEmail } from './email.js'; // Import the sendEmail function from email.js

// Function to sign up a new user with email and password
function signUpWithEmailAndPassword(email, password) {
  return auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Add additional user data to Firebase Realtime Database
      const user = userCredential.user;
      const { uid, email } = user;

      // Example: Save additional user data to Firebase Realtime Database
      db.ref('users/' + uid).set({
        email: email,
        // Add other user properties as needed
      });

      // Send OTP email after successful signup
      sendOTP(email);

      return user;
    })
    .catch((error) => {
      throw error;
    });
}

// Function to sign in a user with email and password
function signInWithEmailAndPassword(email, password) {
  return auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Check if user is verified with OTP
      if (user.emailVerified) {
        console.log('User signed in:', user);
        // Optionally, redirect or show logged-in UI to the user
      } else {
        // Send OTP email for verification
        sendOTP(email);
        console.log('OTP sent for verification');
        // Optionally, inform the user to check their email for OTP
      }

      return user;
    })
    .catch((error) => {
      throw error;
    });
}

// Function to sign out the current user
function signOut() {
  return auth.signOut();
}

// Function to get the current user
function getCurrentUser() {
  return auth.currentUser;
}

// Function to send OTP email using EmailJS
function sendOTP(email) {
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
          <p>Sincerely,</p>
          <p>The Team</p>
      </body>
      </html>
    `,
    // Additional template parameters can be added as needed
  };

  // Send email using EmailJS
  sendEmail(email, templateParams);
}

// Example usage in context of index.html
function handleSignUp() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  signUpWithEmailAndPassword(email, password)
    .then((user) => {
      console.log('User signed up:', user);
      // Optionally, redirect or show success message to the user
    })
    .catch((error) => {
      console.error('Error signing up:', error.message);
      // Optionally, display error message to the user
    });
}

function handleSignIn() {
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;

  signInWithEmailAndPassword(email, password)
    .then((user) => {
      // This part checks if the user is already verified with OTP
      if (user.emailVerified) {
        console.log('User signed in:', user);
        // Optionally, redirect or show logged-in UI to the user
      } else {
        console.log('OTP sent for verification');
        // Optionally, inform the user to check their email for OTP
      }
    })
    .catch((error) => {
      console.error('Error signing in:', error.message);
      // Optionally, display error message to the user
    });
}

function handleSignOut() {
  signOut()
    .then(() => {
      console.log('User signed out');
      // Optionally, redirect or show logged-out UI to the user
    })
    .catch((error) => {
      console.error('Error signing out:', error.message);
      // Optionally, display error message to the user
    });
}

export {
  signUpWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getCurrentUser,
  handleSignUp,
  handleSignIn,
  handleSignOut
};
