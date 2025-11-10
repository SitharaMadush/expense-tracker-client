import { defineStore } from "pinia";
import api from "@/lib/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: null,
  }),
  actions: {
    async register(payload) {
      await api.post("/register", payload);
    },
    async login(payload) {
      const { data } = await api.post("/login", payload);
      this.token = data.token;
      localStorage.setItem("token", this.token);
      await this.fetchMe();
    },
    async fetchMe() {
      this.user = (await api.get("/me")).data;
    },
    async logout() {
      try {
        await api.post("/logout");
      } catch {}
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
    },
  },
});
