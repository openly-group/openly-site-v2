import { createRouter, createWebHistory } from 'vue-router';
// @ts-ignore
import Home from '../views/Home.vue';
// @ts-ignore
import Login from '../views/Login.vue';
// @ts-ignore
import Logout from '../views/Logout.vue';
// @ts-ignore
import NotFound from '../views/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
  },
  {
    path: '/:catchAll(.*)',
    name: 'Not Found',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
