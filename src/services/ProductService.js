import { firestore } from '@/firebase'; // Import Firebase Firestore

const productsCollection = firestore.collection('products');

export default {
  async getProducts() {
    const snapshot = await productsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async createProduct(productData) {
    const docRef = await productsCollection.add(productData);
    return docRef.id;
  },

  async deleteProduct(productId) {
    await productsCollection.doc(productId).delete();
  },

  // Implement other CRUD operations as needed
};