/* eslint-disable @typescript-eslint/no-require-imports */
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const args = process.argv.slice(2);
const uid = args[0];

if (!uid) {
  console.error("Please provide a UID: node set-admin.js <uid>");
  process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { role: 'admin' })
  .then(() => {
    console.log(`Successfully set admin role for user: ${uid}`);
    process.exit(0);
  })
  .catch(err => {
    console.error("Error setting custom claims:", err);
    process.exit(1);
  });
