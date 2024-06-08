<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
      <h1 class="text-2xl font-bold mb-6 text-center">Register</h1>

      <div class="mb-4">
        <button @click="authenticateWithGoogle" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Register with Google
        </button>
      </div>

      <div class="mb-4">
        <input v-model="email" type="email" placeholder="Email" class="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300">
      </div>
      <div class="mb-4">
        <input v-model="password" type="password" placeholder="Password" class="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300">
      </div>
      <div class="mb-4">
        <button @click="registerWithEmailPassword" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          Register
        </button>
      </div>
      <router-link :to="{ name: 'signup' }" class="text-blue-600 hover:text-blue-800 underline hover:no-underline">SignUp</router-link>
      <p v-if="errorMessage" class="text-red-500 text-xs italic">{{ errorMessage }}</p>
    </div>
  </div>
</template>
<script>
import { auth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from '../firebase';
import { db } from '../firebase'; // Ensure db is correctly imported
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async authenticateWithGoogle() {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        // User signed in or registered with Google
        const user = result.user;
        await this.saveUserToFirestore(user);
        this.$router.push({ name: 'feed' }); // Redirect to home page
      } catch (error) {
        console.error('Error with Google authentication:', error);
        this.errorMessage = this.getErrorMessage(error.code);
      }
    },
    async registerWithEmailPassword() {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        // User registered with email and password
        const user = userCredential.user;
        await this.saveUserToFirestore(user);
        this.$router.push({ name: 'feed' }); // Redirect to home page
      } catch (error) {
        console.error('Error with email/password registration:', error);
        this.errorMessage = this.getErrorMessage(error.code);
      }
    },
    async saveUserToFirestore(user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
        createdAt: serverTimestamp()
      }, { merge: true });
    },
    getErrorMessage(errorCode) {
      switch (errorCode) {
        case 'auth/invalid-email':
          return 'Invalid email address. Please check the email format and try again.';
        case 'auth/email-already-in-use':
          return 'The email address is already in use by another account. Please use a different email address.';
        case 'auth/weak-password':
          return 'The password is too weak. Please use a stronger password.';
        default:
          return 'An unexpected error occurred. Please try again later.';
      }
    }
  }
}
</script>

<style scoped>


</style>
