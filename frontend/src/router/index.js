import { createRouter, createWebHistory } from 'vue-router'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import UpdateProfile from '../views/ModifyProfile.vue'
import Posts from '../views/Posts.vue'
import UpdatePost from '../views/ModifyPost.vue'
import UpdateComment from '../views/ModifyComment.vue'

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
  },
  {
    path:'/posts',
    name:'Posts',
    component: Posts
  },
  {
    path:'/modifyPost/:postId',
    name:'ModifyPost',
    component: UpdatePost
  },
  {
    path:'/modifyComment/:commentId',
    name:'ModifyComment',
    component: UpdateComment
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
