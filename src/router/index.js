import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Welcome from '../views/Customers/CustomersWelcomepage.vue';
import Course from '../views/campus/lectures.vue';
import Details from '@/views/campus/details.vue';
import NotAvailable from '../views/NotAvailable.vue';
import Register from '../views/Register.vue';
import Signup from '../views/Signup.vue';
import { auth } from '../firebase'; // Import firebase auth module
import Users from '../views/Users'
import Productdetails from '../views/Customers/CustomersProductdetails.vue'
import CartPage  from '../views/Customers/AddCart'



const routes = [
  // Non-protected routes
  {
    path: '/about',
    name: 'about',
    component: Welcome,
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
    meta: { requiresAuth: true },
  },
  {
    path: '/lectures',
    name: 'course',
    component: Course,
    meta: { requiresAuth: true },
    
  },
  {
    path: '/campus/:id',
    name: 'lectures',
    component: Details,
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
    path: '/users',
    name: 'users',
    component: Users,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});



router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    next('/register'); // Redirect to registration page if authentication is required but user is not logged in
  } else {
    next(); // Proceed to the requested route
  }
});

export default router;
