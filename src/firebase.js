import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Configuration - using the same as admin-app for consistency
// TODO: Replace with production config for deployment
const firebaseConfig = {
    apiKey: "demo-key",
    authDomain: "demo-project.firebaseapp.com",
    projectId: "demo-project",
    storageBucket: "demo-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
let app;
let db;

if (typeof window !== 'undefined') {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} else {
    // Mock for SSR (Node.js) to prevent build errors
    // Since fetch logic is in onMounted (client-side), this is safe
    db = {};
}

// Connect to emulator if on localhost
// Note: You might need to adjust the port if your emulator runs on a different one
if (typeof window !== 'undefined' && window.location && window.location.hostname === "localhost") {
    // connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('configured for emulator (uncomment connectFirestoreEmulator if running one)');
}

export { db };
