<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-neutral-900"
  >
    <header
      class="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-slate-900/70 border-b border-gray-200 dark:border-slate-800"
    >
      <div
        class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-indigo-600"></div>
          <h1 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
            <RouterLink to="/">Portfolio Admin</RouterLink>
          </h1>
        </div>

        <nav class="hidden md:flex items-center gap-2">
          <RouterLink
            class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium hover:border-b-3 hover:border-indigo-600 transition text-slate-700 dark:text-slate-200"
            to="/transactions"
            >Transactions</RouterLink
          >

          <RouterLink
            class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium hover:border-b-3 hover:border-indigo-600 transition text-slate-700 dark:text-slate-200"
            to="/categories"
            >Categories</RouterLink
          >

          <!-- Theme toggle -->
          <button
            class="btn-ghost border-2 border-gray-200"
            @click="toggleTheme"
            :title="`Theme: ${theme.mode}`"
            aria-label="Toggle theme"
          >
            <span
              v-if="theme.mode === 'system'"
              class="inline-flex items-center gap-2"
            >
              <!-- system icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-slate-700 dark:text-slate-200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-width="1.8"
                  d="M12 3v2m0 14v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M3 12h2m14 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                />
                <circle cx="12" cy="12" r="4" stroke-width="1.8" />
              </svg>
              <span
                class="hidden sm:inline text-sm text-slate-700 dark:text-slate-200"
                >System</span
              >
            </span>
            <span
              v-else-if="theme.mode === 'dark'"
              class="inline-flex items-center gap-2"
            >
              <!-- moon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-slate-700 dark:text-slate-200"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
              </svg>
              <span
                class="hidden sm:inline text-sm text-slate-700 dark:text-slate-200"
                >Dark</span
              >
            </span>
            <span v-else class="inline-flex items-center gap-2">
              <!-- sun -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-amber-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M6.76 4.84 5.34 3.42 3.92 4.84l1.42 1.42 1.42-1.42Zm10.48 0 1.42-1.42 1.42 1.42-1.42 1.42-1.42-1.42ZM12 2h-0v2h0V2Zm0 18h-0v2h0v-2ZM2 12H4v0H2v0Zm16 0h2v0h-2v0ZM6.76 19.16 5.34 20.58 3.92 19.16l1.42-1.42 1.42 1.42Zm10.48 0 1.42-1.42 1.42 1.42-1.42 1.42-1.42-1.42ZM12 6a6 6 0 100 12A6 6 0 0012 6Z"
                />
              </svg>
              <span
                class="hidden sm:inline text-sm text-slate-700 dark:text-slate-200"
                >Light</span
              >
            </span>
          </button>

          <button class="btn-primary" @click="logout">Logout</button>
        </nav>
        <button
          @click="menuOpen = !menuOpen"
          class="flex md:hidden btn text-slate-700 dark:text-slate-200"
        >
          <span class="inline-flex items-center gap-2">
            <svg style="width: 20px; height: 20px" viewBox="0 0 20 20">
              <path
                fill="currentColor"
                d="M1,4 H18 V6 H1 V4 M1,9 H18 V11 H1 V7 M3,14 H18 V16 H1 V14"
              />
            </svg>
          </span>
        </button>
      </div>
      <!-- Mobile slide-down menu -->
      <transition name="fade">
        <div
          v-if="menuOpen"
          class="md:hidden absolute inset-x-0 top-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-md"
        >
          <nav class="flex flex-col items-start p-4 space-y-3">
            <RouterLink
              class="btn-ghost w-full text-left"
              :class="{
                'bg-indigo-50 dark:bg-slate-800':
                  $route.name === 'transactions',
              }"
              to="/transactions"
              @click="closeMenu"
              >Transactions</RouterLink
            >
            <RouterLink
              class="btn-ghost w-full text-left"
              :class="{
                'bg-indigo-50 dark:bg-slate-800': $route.name === 'categories',
              }"
              to="/categories"
              @click="closeMenu"
              >Categories</RouterLink
            >
            <button class="btn-ghost w-full text-left" @click="toggleTheme">
              Toggle Theme
            </button>
            <button class="btn-ghost w-full text-left" @click="logout">
              Logout
            </button>
          </nav>
        </div>
      </transition>
    </header>

    <main
      class="mx-auto max-w-6xl p-4 md:p-8 text-slate-800 dark:text-slate-100"
    >
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme";

const auth = useAuthStore();
const router = useRouter();
const theme = useThemeStore();
let menuOpen = ref(false);

const logout = async () => {
  await auth.logout();
  router.push({ name: "login" });
};
const toggleTheme = () => theme.toggle();
</script>
