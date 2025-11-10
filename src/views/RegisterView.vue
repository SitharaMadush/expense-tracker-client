<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
const name = ref("Demo");
const email = ref("demo2@example.com");
const password = ref("secret123");
const password_confirmation = ref("secret123");
const msg = ref("");
const error = ref("");
const auth = useAuthStore();
const submit = async () => {
  error.value = "";
  msg.value = "";
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });
    msg.value = "Registered! Now sign in.";
  } catch (e) {
    error.value = e?.response?.data?.message || "Registration failed";
  }
};
</script>

<template>
  <div
    class="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4"
  >
    <div class="card w-full max-w-md">
      <h2 class="title mb-6">Create account</h2>
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm">Name</label
          ><input v-model="name" class="input" required />
        </div>
        <div>
          <label class="block text-sm">Email</label
          ><input v-model="email" type="email" class="input" required />
        </div>
        <div>
          <label class="block text-sm">Password</label
          ><input v-model="password" type="password" class="input" required />
        </div>
        <div>
          <label class="block text-sm">Confirm Password</label
          ><input
            v-model="password_confirmation"
            type="password"
            class="input"
            required
          />
        </div>
        <button class="btn-primary w-full">Create account</button>
      </form>
      <p v-if="msg" class="mt-3 text-sm text-green-700">{{ msg }}</p>
      <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
      <p class="text-sm mt-4">
        Already have an account?
        <RouterLink to="/login" class="text-indigo-600 hover:underline"
          >Sign in</RouterLink
        >
      </p>
    </div>
  </div>
</template>
