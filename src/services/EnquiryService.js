import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Config - using placeholder values for emulator
const firebaseConfig = {
    apiKey: "demo-key",
    authDomain: "demo-project.firebaseapp.com",
    projectId: "demo-project",
    storageBucket: "demo-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

let db;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);

    // Connect to emulator
    if (location.hostname === "localhost") {
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log('Main App Connected to Firestore Emulator');
    }
} catch (e) {
    console.error("Firebase init error", e);
}

export const EnquiryService = {
    async submitEnquiry(enquiryData) {
        try {
            if (!db) {
                // Try initializing again if failed initially or lazy load
                console.warn("Database not initialized, retrying...");
                const app = initializeApp(firebaseConfig);
                db = getFirestore(app);
                if (location.hostname === "localhost") {
                    connectFirestoreEmulator(db, 'localhost', 8080);
                }
            }

            const docRef = await addDoc(collection(db, "enquiries"), {
                ...enquiryData,
                createdAt: serverTimestamp()
            });

            console.log("Enquiry submitted with ID: ", docRef.id);
            return { id: docRef.id, succes: true };
        } catch (error) {
            console.error('Enquiry Submission Error:', error);
            throw error;
        }
    }
};
