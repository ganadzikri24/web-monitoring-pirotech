const admin = require('firebase-admin');
const serviceAccount = require('c:\\Users\\USER\\Downloads\\prikitiw-18dde-firebase-adminsdk-fbsvc-1ff3b857df.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://prikitiw-18dde-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

async function test() {
  try {
    console.log("Starting admin query...");
    const batchesRef = db.ref('batches').orderByChild('status').equalTo('running');
    const snap = await batchesRef.once('value');
    console.log("Exists?", snap.exists());
    if (snap.exists()) {
      console.log(snap.val());
    }
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
test();
