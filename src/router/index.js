import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import About from '../views/AboutView.vue'
import Course from '../views/campus/lectures'
import Details from '@/views/campus/details.vue'
import NotAvailable from '../views/NotAvailable.vue'
import Register  from '../views/Register.vue'
import Signup from  '../views/Signup.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component:About
  },
  {
    path: '/lectures',
    name: 'course',
    component:Course
  },
  {
    path: '/campus/:id',
    name: 'lectures',
    component: Details,
    props:true,

  },
  //404 page
  {
    path: '/:catchAll(.*)',
    name: 'NotAvailables',
    component: NotAvailable,
    

  },
  {
    path: '/Register',
    name: 'register',
    component: Register,
  },
  {
    path: '/Signup',
    name: 'signup',
    component: Signup,
  },


  //redirecting
  {
    path:'/all-jobs',// incase someone taps to this path
    redirect:'/lectures', // he is redircted to this page with this name under the routes which are available
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
