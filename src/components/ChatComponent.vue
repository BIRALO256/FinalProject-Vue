    <template>
        <div class="chat-container bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold mb-4">{{ translated.title }}</h2>
    
        <!-- Messages Display -->
        <div class="messages-container overflow-y-auto h-80 mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div
            v-for="message in messages"
            :key="message.id"
            :class="{ 'self-end': message.senderId === user.uid }"
            >
            <div class="message mb-2 p-2 bg-blue-100 rounded-lg">
                <p class="font-semibold">{{ message.senderName }}:</p>
                <p>{{ message.text }}</p>
                <p class="text-xs text-gray-500">{{ formatTimestamp(message.timestamp) }}</p>
            </div>
            </div>
        </div>
    
        <!-- Message Input -->
        <div class="flex">
            <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            class="flex-grow p-2 border border-gray-300 rounded-lg mr-2"
            placeholder="Type your message here..."
            />
            <button
            @click="sendMessage"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
            {{ translated.send }}
            </button>
        </div>
        </div>
    </template>
    
    <script>
    import { ref, onMounted, computed, watch } from 'vue';
    import { db } from '@/firebase';
    import { collection, addDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
    import { useStore } from 'vuex';
    import { translateText } from '@/utils/translate';
    
    export default {
        name: 'ChatComponent',
        props: {
        supplierId: {
            type: String,
            required: true
        }
        },
        setup(props) {
        const store = useStore();
        const user = computed(() => store.state.user);
        const messages = ref([]);
        const newMessage = ref('');
        const translated = ref({
            title: 'Chat with Supplier',
            send: 'Send'
        });
    
        const fetchMessages = () => {
            const q = query(
            collection(db, 'chats'),
            where('supplierId', '==', props.supplierId),
            orderBy('timestamp', 'asc')
            );
            onSnapshot(q, (snapshot) => {
            messages.value = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            });
        };
    
        const sendMessage = async () => {
            if (newMessage.value.trim() === '') return;
    
            await addDoc(collection(db, 'chats'), {
            text: newMessage.value,
            senderId: user.value.uid,
            senderName: user.value.displayName || 'Buyer',
            supplierId: props.supplierId, // Add supplierId to each message
            timestamp: new Date()
            });
    
            newMessage.value = '';
        };
    
        const formatTimestamp = (timestamp) => {
            const date = new Date(timestamp.seconds * 1000);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        };
    
        const translateLabels = async () => {
            const language = store.state.language;
            translated.value.title = await translateText('Chat with Supplier', language);
            translated.value.send = await translateText('Send', language);
        };
    
        onMounted(() => {
            fetchMessages();
            translateLabels();
        });
    
        watch(() => props.supplierId, fetchMessages); // Fetch new messages when supplierId changes
    
        return {
            messages,
            newMessage,
            sendMessage,
            formatTimestamp,
            translated,
            user
        };
        }
    };
    </script>
    
    <style scoped>
    .chat-container {
        max-height: 90vh;
        overflow-y: auto;
    }
    .messages-container {
        max-height: 70vh;
        overflow-y: scroll;
    }
    .message {
        max-width: 75%;
        word-wrap: break-word;
    }
    .self-end {
        align-self: flex-end;
        background-color: #d1f7c4;
    }
    </style>
    