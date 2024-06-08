<template>
    
    <div>
        <AdminNavbar/>
    </div>
  
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">System Users</h1>
      <div v-if="loading">
        <p>Loading...</p>
    </div>
    <div v-else-if="error">
        <p>{{ error }}</p>
    </div>
    <div v-else>
        <table class="min-w-full table-auto">
        <thead class="bg-gray-200">
                <tr>
                <th class="px-4 py-2">Display Name</th>
                <th class="px-4 py-2">Email</th>
                <th class="px-4 py-2">Created At</th>
                <th class="px-4 py-2">Actions</th>
                </tr>
        </thead>
        <tbody>
            <tr v-for="user in users" :key="user.uid">
            <td class="border px-4 py-2">{{ user.displayName }}</td>
            <td class="border px-4 py-2">{{ user.email }}</td>
            <td class="border px-4 py-2">{{ user.createdAt.toDate().toLocaleString() }}</td>
            <td class="border px-4 py-2">
                <button @click="deleteUser(user.uid)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                Delete
                </button>
            </td>
            </tr>
        </tbody>
        </table>
    </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import AdminNavbar  from '../components/AdminNavbar.vue';

export default {

    components: {
        AdminNavbar
    },

    setup() {

    const users = ref([]);
    const loading = ref(false);
    const error = ref('');

    const fetchUsers = async () => {
        loading.value = true;
        error.value = '';
        try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        users.value = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            uid: doc.id
        }));
        } catch (err) {
        error.value = 'Failed to fetch users. Please try again.';
        console.error(err);
        } finally {
        loading.value = false;
        }
    };

    const deleteUser = async (uid) => {
        try {
        await deleteDoc(doc(db, 'users', uid));
          fetchUsers(); // Refresh the list after deleting
        } catch (err) {
        error.value = 'Failed to delete user. Please try again.';
        console.error(err);
        }
    };

    onMounted(fetchUsers);

    return { users, deleteUser, loading, error };
    }
};
</script>

<style>
nav {
  background-color: #2d3748; /* Darker shade for the navbar */
padding: 1rem;
}

nav a {
text-decoration: none;
  color: #cbd5e0; /* Light gray text */
padding: 0.5rem;
margin-right: 1rem;
}

nav a:hover {
  color: #e2e8f0; /* Lighter gray on hover */
}
</style>