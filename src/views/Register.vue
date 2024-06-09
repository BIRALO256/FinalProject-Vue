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
        <input v-model="displayName" type="text" placeholder="Display Name" required class="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300">
        <p v-if="!displayName" class="text-red-500 text-xs italic">Display name is required.</p>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { auth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from '../firebase';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const email = ref('');
    const password = ref('');
    const displayName = ref('');
    const errorMessage = ref('');

    const authenticateWithGoogle = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || '',
          role: 0  // Default role for new users
        };
        await saveUserToFirestore(user);
        store.dispatch('setUser', user);
        router.push({ name: user.role === 1 ? 'feed' : 'about' });
      } catch (error) {
        console.error('Error with Google authentication:', error);
        errorMessage.value = getErrorMessage(error.code);
      }
    };

    const registerWithEmailPassword = async () => {
      if (!displayName.value) {
        errorMessage.value = "Display name is required.";
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: displayName.value,
          role: 0  // Default role for new users
        };
        await saveUserToFirestore(user);
        store.dispatch('setUser', user);
        router.push({ name: user.role === 1 ? 'feed' : 'about' });
      } catch (error) {
        console.error('Error with email/password registration:', error);
        errorMessage.value = getErrorMessage(error.code);
      }
    };

    const saveUserToFirestore = async (user) => {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        createdAt: serverTimestamp()
      }, { merge: true });
    };

    const getErrorMessage = (errorCode) => {
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
    };

    return {
      email,
      password,
      displayName,
      errorMessage,
      authenticateWithGoogle,
      registerWithEmailPassword
    };
  }
}
</script>

<style scoped>
/* Add your styles here if needed */
</style>