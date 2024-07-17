import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Welcome from '../views/Customers/CustomersWelcomepage.vue';
import NotAvailable from '../views/NotAvailable.vue';
import Register from '../views/Register.vue';
import Signup from '../views/Signup.vue';
import { auth } from '../firebase'; 
import Users from '../views/Users'
import Productdetails from '../views/Customers/CustomersProductdetails.vue'
import Order    from '../views/Customers/Orders.vue'
import CartPage  from '../views/Customers/AddCart'
import CheckOut from '../views/Customers/CheckOut'
import Payement from '../views/Customers/Payement'
import Profile from '../views/Customers/Profilepage.vue'
import store from '../store/index'; // Import the store



const routes = [
  // Non-protected routes
  {
    path: '/about',
    name: 'about',
    component: Welcome,
    meta: { requiresAuth: true },
  },
  
  {
    path: '/Payement',
    name: 'Payement',
    component: Payement,
    meta: { requiresAuth: true },
  },
  {
    path: '/Checkout',
    name: 'checkout',
    component: CheckOut,
    meta: { requiresAuth: true },
  },
  {
    path: '/addcart',
    name: 'cart',
    component: CartPage,
    meta: { requiresAuth: true },
  },
  {
  path: '/productDetails/:id',
  name: 'product-details',
  component: Productdetails,
  props: true,
  meta: { requiresAuth: true },
  },

  // 404 page
  {
    path: '/:catchAll(.*)',
    name: 'NotAvailables',
    component: NotAvailable,
    meta: { requiresAuth: true },
  },
  // Registration and sign-in pages
  {
    path: '/register',
    name: 'register',
    component: Register,
    
  },
  {
    path: '/',
    name: 'signup',
    component: Signup,
  },
  // Redirecting
  {
    path: '/all-jobs',
    redirect: '/lectures',
    meta: { requiresAuth: true },
  },
  // Protected route
  {
    path: '/feed',
    name: 'feed',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/Orders',
    name: 'Orders',
    // props: true,
    component: Order,
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
    meta: { requiresAuth: true },
  },
  {
    path: '/usersprofile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = store.state.user; // Get user from Vuex store

  if (requiresAuth && !currentUser) {
    next('/register'); // Redirect to registration page if authentication is required but user is not logged in
  } else {
    next(); // Proceed to the requested route
  }
});

export default router;
