import { createRouter, createWebHistory } from 'vue-router'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import UpdateProfile from '../views/ModifyProfile.vue'

const routes = [
  {
    path: '/',
    name:'Signup',
    component: Signup
  },
  {
    path: '/login',
    name:'Login',
    component: Login
  },
  {
    path:'/profile',
    name:'Profile',
    component: Profile
  },
  {
    path:'/modifyProfile',
    name:'ModifyProfile',
    component: UpdateProfile
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
