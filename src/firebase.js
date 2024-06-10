import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcLcT2a_aXdI-P7DdLaI4K9pjcJOqXFp0",
  authDomain: "vueyellow-bb35f.firebaseapp.com",
  projectId: "vueyellow-bb35f",
  storageBucket: "vueyellow-bb35f.appspot.com",
  messagingSenderId: "795423669857",
  appId: "1:795423669857:web:a511084510f8c094767420"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, db, storage, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword };