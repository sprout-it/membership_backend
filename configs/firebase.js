var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://membership-ecaaa.firebaseio.com"
});

module.exports = {
    auth: admin.auth(),
    firestore: admin.firestore(),
    admin: admin.firestore()
}