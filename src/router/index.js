import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/Auth/RegisterView.vue';
import { useAuthStore } from '@/stores/auth';
import CreateExpenseView from '@/views/Expenses/CreateExpenseView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { auth: true }

    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guest:true }
    },
    { 
      path: '/register', 
      name: 'register',
      component: RegisterView,
      meta: { guest:true }
    },
    { 
      path: '/expenses/create', 
      name: 'expenses.create',
      component: CreateExpenseView, 
      meta: { auth: true }
    },
  ]
});

router.beforeEach(async (to, from) => {

  const authStore = useAuthStore();
  await authStore.getUser();

  if(authStore.user && to.meta.guest){
    return { name: 'home' };
  }

  if(!authStore.user && to.meta.auth){
    return { name: 'login' };
  }

})

export default router
