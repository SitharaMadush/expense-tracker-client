import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import TransactionsView from "@/views/TransactionsView.vue";
import CategoriesView from "@/views/CategoriesView.vue";
import AppLayout from "@/components/AppLayout.vue";
import { useAuthStore } from "@/stores/auth";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
      //   meta: { guestOnly: true },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: "/",
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        { path: "", name: "home", component: HomeView },
        {
          path: "transactions",
          name: "transactions",
          component: TransactionsView,
        },
        { path: "categories", name: "categories", component: CategoriesView },
      ],
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.token) return { name: "login" };
  if (to.meta.guestOnly && auth.token) return { name: "transactions" };
});

export default router;
