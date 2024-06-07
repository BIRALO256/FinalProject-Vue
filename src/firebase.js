import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

//  web app's Firebase configuration
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
const auth = getAuth(app);
const db   = getFirestore(app)

//firestore instance

// Exporting auth and related methods for use in components
export { auth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword ,db };