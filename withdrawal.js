document.getElementById('withdrawalForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const paymentMethod = document.getElementById('payment').value;
  const amount = document.getElementById('Amount').value;
  const fullname = document.getElementById('fullname').value;
  const wallet = document.getElementById('wallet').value;
  const user = firebase.auth().currentUser;

  if (user) {
    const userEmail = user.email;

    // Save withdrawal request to database
    db.ref('withdrawals/').push({
      userId: user.uid,
      paymentMethod: paymentMethod,
      amount: amount,
      fullname: fullname,
      wallet: wallet,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
      alert('Withdrawal request submitted successfully.');

      // Send email notification to user and admin
      const otp = generateOTP();

      const withdrawalDetails = {
        to_name: fullname,
        to_email: userEmail,
        amount: amount,
        otp: otp,
        admin_email: 'admin@example.com'
      };

      emailjs.send("YOUR_SERVICE_ID", "YOUR_USER_TEMPLATE_ID", withdrawalDetails)
        .then((response) => {
          alert('Withdrawal confirmation email sent to you.');
          return db.ref('users/' + user.uid + '/withdrawalOtp').set({
            otp: otp
          });
        })
        .catch((error) => {
          alert('Error sending confirmation email: ' + error.message);
        });

      emailjs.send("YOUR_SERVICE_ID", "YOUR_ADMIN_TEMPLATE_ID", withdrawalDetails)
        .then((response) => {
          console.log('Admin notified of withdrawal request.');
        })
        .catch((error) => {
          console.error('Error notifying admin: ' + error.message);
        });
    }).catch((error) => {
      alert('Error: ' + error.message);
    });
  } else {
    alert('You must be logged in to submit a withdrawal request.');
  }
});
