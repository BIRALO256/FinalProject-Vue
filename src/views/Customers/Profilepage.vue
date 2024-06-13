    <template>
        <div>
        <CustomersNavbar />
        <div class="min-h-screen bg-gray-100 p-6">
            <div class="container mx-auto max-w-4xl mt-10 bg-white p-6 rounded-lg shadow-lg">
            <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Profile</h1>
            <form @submit.prevent="updateProfile" class="space-y-6">
                <div class="flex items-center space-x-6">
                <div class="w-32 h-32">
                    <img :src="profilePictureUrl" alt="Profile Picture" class="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Profile Picture</label>
                    <input type="file" @change="onFileChange" class="mt-1 block w-full" />
                </div>
                </div>
                <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input v-model="displayName" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input v-model="email" type="email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" disabled />
                </div>
                <div v-if="!isGoogleUser">
                <label class="block text-sm font-medium text-gray-700">Password</label>
                <input v-model="password" type="password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                <label class="block text-sm font-medium text-gray-700">Payment Information</label>
                <input v-model="paymentInfo" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <button type="submit" class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out w-full">
                Update Profile
                </button>
            </form>
            </div>
        </div>
        </div>
    </template>
    
    <script>
    import { ref } from 'vue';
    import { getAuth, updateProfile, updatePassword } from 'firebase/auth';
    import { useStore } from 'vuex';
    import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
    import { doc, getFirestore, updateDoc } from 'firebase/firestore';
    import CustomersNavbar from '@/components/CustomersNavbar.vue';
    
    export default {
        components: {
        CustomersNavbar,
        },
        setup() {
        const store = useStore();
        const auth = getAuth();
        const storage = getStorage();
        const firestore = getFirestore();
        const user = auth.currentUser;
    
        const displayName = ref(user ? user.displayName : '');
        const email = ref(user ? user.email : '');
        const profilePictureUrl = ref(user && user.photoURL ? user.photoURL : 'https://via.placeholder.com/150');
        const password = ref('');
        const paymentInfo = ref('');
    
        const isGoogleUser = user && user.providerData.some(provider => provider.providerId === 'google.com');
    
        const onFileChange = async (event) => {
            const file = event.target.files[0];
            if (file) {
            const storageReference = storageRef(storage, `profile_pictures/${user.uid}`);
            await uploadBytes(storageReference, file);
            const downloadURL = await getDownloadURL(storageReference);
            profilePictureUrl.value = downloadURL;
            }
        };
    
        const updateProfile = async () => {
            try {
            await updateProfile(auth.currentUser, {
                displayName: displayName.value,
                profilePictureUrl: profilePictureUrl.value,
            });
    
            if (password.value) {
                await updatePassword(auth.currentUser, password.value);
            }
    
            const userDoc = doc(firestore, 'users', user.uid);
            await updateDoc(userDoc, {
                displayName: displayName.value,
                profilePictureUrl: profilePictureUrl.value,
                paymentInfo: paymentInfo.value,
            });
    
            store.dispatch('setUser', auth.currentUser);
            alert('Profile updated successfully!');
            } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile.');
            }
        };
    
        return { displayName, email, profilePictureUrl, onFileChange, updateProfile, password, paymentInfo, isGoogleUser };
        }
    };
    </script>
    
    <style scoped>
    /* Additional styles if needed */
    </style>
    