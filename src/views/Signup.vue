<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 class="text-2xl font-bold mb-6 text-center">Sign In</h1>

      <div class="mb-4">
        <button @click="authenticateWithGoogle" class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Sign In with Google
        </button>
      </div>

      <div class="mb-4">
        <input v-model="email" type="email" placeholder="Email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <input v-model="password" type="password" placeholder="Password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <button @click="signInWithEmailPassword" class="w-full bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Sign In
        </button>
      </div>
      <br>
      <router-link :to="{ name: 'register' }" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Register</router-link>
    
      <p v-if="errorMessage" class="text-red-500 text-xs italic">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { auth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from '../firebase';

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
        console.log('User signed in with Google:', result.user);
        this.$router.push({ name: 'feed' }); // Redirect to home page
      } catch (error) {
        console.error('Error with Google sign-in:', error.code);
        this.errorMessage = this.getErrorMessage(error.code);
      }
    },
    async signInWithEmailPassword() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        console.log('User signed in with email and password:', userCredential.user);
        this.$router.push({ name: 'feed' }); // Redirect to home page
      } catch (error) {
        console.error('Error with email/password sign-in:', error.code);
        this.errorMessage = this.getErrorMessage(error.code);
      }
    },
    getErrorMessage(errorCode) {
      switch (errorCode) {
        case 'auth/invalid-email':
          return 'Invalid email address. Please check the email format and try again.';
        case 'auth/user-disabled':
          return 'Your account has been disabled. Please contact support for assistance.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          return 'Invalid email or password. Please check your credentials and try again.';
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
