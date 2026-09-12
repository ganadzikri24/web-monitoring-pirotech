const { initializeApp } = require('firebase/app');
const { getDatabase, ref, query, orderByChild, equalTo, get, push, set } = require('firebase/database');

const app = initializeApp({
  apiKey: "AIzaSyBomWLQLJ_ZUX_ut2q5zPbHMHoG9IeZLxA",
  authDomain: "prikitiw-18dde.firebaseapp.com",
  databaseURL: "https://prikitiw-18dde-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "prikitiw-18dde",
});

const db = getDatabase(app);

async function test() {
  try {
    console.log("Starting test...");
    
    // 1. Try to query running batch
    const batchesRef = query(ref(db, 'batches'), orderByChild('status'), equalTo('running'));
    const snap1 = await get(batchesRef);
    console.log("Exists?", snap1.exists());
    if (snap1.exists()) {
      console.log("Value:", snap1.val());
    }

  } catch (err) {
    console.error("Error:", err);
  }
  process.exit(0);
}

test();
