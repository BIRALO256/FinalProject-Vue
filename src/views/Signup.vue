<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
      <h1 class="text-2xl font-bold mb-6 text-center">Sign In</h1>

      <div class="mb-4">
        <button @click="authenticateWithGoogle" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Sign In with Google
        </button>
      </div>

      <div class="mb-4">
        <input v-model="email" type="email" placeholder="Email" class="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300">
      </div>
      <div class="mb-4">
        <input v-model="password" type="password" placeholder="Password" class="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300">
      </div>
      <div class="mb-4">
        <button @click="signInWithEmailPassword" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          Sign In
        </button>
      </div>
      <router-link :to="{ name: 'register' }" class="text-blue-600 hover:text-blue-800 underline hover:no-underline">Register</router-link>
      <p v-if="errorMessage" class="text-red-500 text-xs italic">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { auth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from '../firebase';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const authenticateWithGoogle = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        await saveUserToFirestore(user);
        store.dispatch('setUser', user);
        await handleUserRole(user.uid);
      } catch (error) {
        console.error('Error with Google sign-in:', error);
        errorMessage.value = getErrorMessage(error.code);
      }
    };

    const signInWithEmailPassword = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        // await saveUserToFirestore(user);
        store.dispatch('setUser', user);
        await handleUserRole(user.uid);
      } catch (error) {
        console.error('Error with email/password sign-in:', error);
        errorMessage.value = getErrorMessage(error.code);
      }
    };

    const saveUserToFirestore = async (user) => {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
        role: 0,  // Default role for new users
        createdAt: serverTimestamp()
      }, { merge: true });
    };

    const handleUserRole = async (uid) => {
      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        store.dispatch('setUser', userData);
        if (userData.role === 1) {
          router.push({ name: 'feed' });
        } else {
          router.push({ name: 'about' });
        }
      } else {
        console.error("User data not found");
      }
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
      errorMessage,
      authenticateWithGoogle,
      signInWithEmailPassword
    };
  }
}
</script>

<style scoped>
/* Add your styles here if needed */
</style>