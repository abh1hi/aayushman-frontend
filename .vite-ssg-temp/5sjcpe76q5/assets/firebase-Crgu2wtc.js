import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
let app;
let db;
if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  db = {};
}
if (typeof window !== "undefined" && window.location && window.location.hostname === "localhost") {
  console.log("configured for emulator (uncomment connectFirestoreEmulator if running one)");
}
export {
  db as d
};
