<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 class="text-2xl font-bold mb-6 text-center">Register</h1>

      <div class="mb-4">
        <button @click="authenticateWithGoogle" class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Register with Google
        </button>
      </div>

      <div class="mb-4">
        <input v-model="email" type="email" placeholder="Email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <input v-model="password" type="password" placeholder="Password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <button @click="registerWithEmailPassword" class="w-full bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Register
        </button>
      </div>
      <router-link :to ="{name:'signup'}">SignUp</router-link>
      <p v-if="errorMessage" class="text-red-500 text-xs italic">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { auth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from '../firebase';

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
        console.log('User signed in or registered with Google:', result.user);
        this.$router.push({ name: 'feed' }); // Redirect to home page
      } catch (error) {
        console.error('Error with Google authentication:', error.code);
        this.errorMessage = this.getErrorMessage(error.code);
      }
    },
    async registerWithEmailPassword() {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        console.log('User registered with email and password:', userCredential.user);
        this.$router.push({ name: 'feed' }); // Redirect to home page
      } catch (error) {
        console.error('Error with email/password registration:', error.code);
        this.errorMessage = this.getErrorMessage(error.code);
      }
    },
    getErrorMessage(errorCode) {
      switch (errorCode) {
        case 'auth/invalid-email':
          return 'Invalid email address. Please check the email format and try again.';
        case 'auth/email-already-in-use':
          return 'The email address is already in use by another account. Please use a different email address.';
        case 'auth/weak-password':
          return 'The password is too weak. Please use a stronger password.';
        case 'auth/popup-closed-by-user':
          return 'The sign-in popup window was closed before completing the operation.';
        case 'auth/cancelled-popup-request':
          return 'The popup request was cancelled by the user.';
        case 'auth/popup-blocked':
          return 'The browser blocked the sign-in popup window. Please enable popups and try again.';
        case 'auth/network-request-failed':
          return 'A network error occurred. Please check your internet connection and try again.';
        default:
          return 'An unexpected error occurred. Please try again later.';
      }
    }
  }
}
</script>

<style scoped>
/* Add your styles here if needed */
</style>
