import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';

// My web app's Firebase configuration
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
const storage = getStorage(app);

// Set persistence to local
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence is set to local");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

const functions = getFunctions(app);

export {
  auth,
  db,
  getAuth,
  storage,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  functions,
  httpsCallable
};
