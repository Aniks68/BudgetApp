import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - Replace with your Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyDYijVCju7wtfV8ZUz34mB82kUVH8Jkvic",
  authDomain: "budget-tracker-70c85.firebaseapp.com",
  projectId: "budget-tracker-70c85",
  storageBucket: "budget-tracker-70c85.firebasestorage.app",
  messagingSenderId: "768832157898",
  appId: "1:768832157898:web:ecac20d4a5002af0679c33",
  measurementId: "G-PE30GC9QCK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
export default app;
