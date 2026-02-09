const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),
});

const uid = 'kfe7QOTRAySWSLbhfcyfZrX2guy2';

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('✅ Admin role assigned');
    process.exit();
  })
  .catch(console.error);

