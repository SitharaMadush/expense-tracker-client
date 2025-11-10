<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
const email = ref("demo@example.com");
const password = ref("demo");
const error = ref("");
const auth = useAuthStore();
const router = useRouter();
const submit = async () => {
  error.value = "";
  try {
    await auth.login({ email: email.value, password: password.value });
    router.push({ name: "home" });
  } catch (e) {
    error.value = e?.response?.data?.message || "Login failed";
  }
};
</script>

<template>
  <div
    class="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4"
  >
    <div class="card w-full max-w-md">
      <h2 class="title mb-6">Welcome back</h2>
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm dark:text-gray-50">Email</label
          ><input v-model="email" type="email" class="input" required />
        </div>
        <div>
          <label class="block text-sm dark:text-gray-50">Password</label
          ><input v-model="password" type="password" class="input" required />
        </div>
        <button class="btn-primary w-full">Sign in</button>
        <p class="text-sm text-gray-500 dark:text-gray-50 mt-2">
          No account?
          <RouterLink to="/register" class="text-indigo-600 dark:text-amber-300 dark:shadow-6xl  hover:underline"
            > Create one</RouterLink
          >
        </p>
      </form>
      <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
    </div>
  </div>
</template>
