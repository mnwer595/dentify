import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBDwl9x6eXTElUCUF-hEvD1OUGAtGT5rWU",
  authDomain: "dentify-d3760.firebaseapp.com",
  projectId: "dentify-d3760",
  storageBucket: "dentify-d3760.firebasestorage.app",
  messagingSenderId: "355320271456",
  appId: "1:355320271456:web:dd567a30be81570f90e905"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app; 