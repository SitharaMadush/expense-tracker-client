<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "@/lib/api";
import moment from "moment";

const items = ref([]);
const categories = ref([]);
const filters = reactive({ q: "", type: "", from: "", to: "", per_page: 15 });
const form = reactive({
  id: null,
  title: "",
  date: moment().format("YYYY-MM-DD"),
  type: "expense",
  amount: 0,
  category_id: null,
  notes: "",
});
const dlg = ref(null);

const fetchList = async () => {
  const { data } = await api.get("/transactions", { params: filters });
  items.value = data.data ?? data;
};
const fetchCategories = async () => {
  const { data } = await api.get("/categories", { params: { per_page: 100 } });
  categories.value = data.data ?? data;
};
const openCreate = () => {
  Object.assign(form, {
    id: null,
    title: "",
    date: moment().format("YYYY-MM-DD"),
    type: "expense",
    amount: 0,
    category_id: null,
    notes: "",
  });
  dlg.value?.showModal();
};
const edit = (t) => {
  Object.assign(form, t, {
    category_id: t.category_id ?? t.category?.id ?? null,
  });
  dlg.value?.showModal();
};
const close = () => dlg.value?.close();
const save = async () => {
  if (form.id) await api.put(`/transactions/${form.id}`, form);
  else await api.post("/transactions", form);
  close();
  await fetchList();
};
const removeTx = async (t) => {
  if (confirm("Delete this transaction?")) {
    await api.delete(`/transactions/${t.id}`);
    await fetchList();
  }
};
const badgeClass = (type) =>
  type === "expense"
    ? "inline-block rounded-full bg-rose-100 px-4 py-1 text-rose-700 text-xs"
    : "inline-block rounded-full bg-emerald-100 px-4 py-1 text-emerald-700 text-xs";
const formatAmount = (n) => new Intl.NumberFormat().format(n);
const debouncedFetch = (() => {
  let h;
  return () => {
    clearTimeout(h);
    h = setTimeout(fetchList, 350);
  };
})();

onMounted(() => Promise.all([fetchList(), fetchCategories()]));
</script>

<template>
  <section class="space-y-6">
    <div>
    </div>
    <div class="flex justify-between">
      <h2 class="title">Transactions</h2>

      <button
        class="btn bg-indigo-600 text-white hover:bg-indigo-700"
        @click="openCreate"
      >
        + Add Transaction
      </button>
    </div>

    <header class="flex flex-col justify-between gap-3">
      <div class="flex flex-col md:flex-row gap-2">
        <input
          v-model="filters.q"
          placeholder="Search..."
          class="input"
          @input="debouncedFetch"
        />
        <select v-model="filters.type" class="input" @change="fetchList">
          <option value="">All types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          v-model="filters.from"
          type="date"
          class="input"
          @change="fetchList"
        />
        <input
          v-model="filters.to"
          type="date"
          class="input"
          @change="fetchList"
        />
      </div>
    </header>

    <div class="card overflow-hidden p-0">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-slate-700">
          <tr
            class="text-left text-xs font-semibold text-slate-50 uppercase tracking-wider"
          >
            <th class="px-4 py-3">Date</th>
            <th class="px-4 py-3">Title</th>
            <th class="px-4 py-3">Type</th>
            <th class="px-4 py-3">Amount</th>
            <th class="px-4 py-3">Category</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="t in items"
            :key="t.id"
            class="hover:bg-gray-50 dark:hover:text-slate-900"
          >
            <td class="px-4 py-3">{{ t.date }}</td>
            <td class="px-4 py-3">{{ t.title }}</td>
            <td class="px-4 py-3">
              <span :class="badgeClass(t.type)">{{ t.type }}</span>
            </td>
            <td class="px-4 py-3 font-medium">{{ formatAmount(t.amount) }}</td>
            <td class="px-4 py-3">
              <span v-if="t.category" class="inline-flex items-center gap-2">
                <span
                  class="inline-block size-3 rounded-full"
                  :style="{ background: t.category.color }"
                ></span
                >{{ t.category.name }}
              </span>
              <span v-else class="text-gray-400">—</span>
            </td>
            <td class="flex gap-2 justify-end px-4 py-3">
              <button
                class="btn bg-emerald-500 hover:bg-emerald-700 text-slate-50 hover:shadow-xl"
                @click="edit(t)"
              >
                Edit
              </button>
              <button
                class="btn bg-red-500 hover:bg-red-700 text-slate-50 hover:shadow-xl"
                @click="removeTx(t)"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="!items.length">
            <td colspan="6" class="px-4 py-10 text-center text-gray-500">
              No results
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <teleport to="#modal-dialog">
      <dialog
        ref="dlg"
        class="modal fixed z-50 hidden items-center justify-center bg-black/40 backdrop-blur-sm open:flex"
      >
        <form
          method="dialog"
          class="card w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-lg"
          @submit.prevent
        >
          <h3 class="title mb-4">{{ form.id ? "Edit" : "Add" }} Transaction</h3>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm">Title</label>
              <input v-model="form.title" class="input" required />
            </div>
            <div>
              <label class="block text-sm">Date</label>
              <input v-model="form.date" type="date" class="input" required />
            </div>
            <div>
              <label class="block text-sm">Type</label>
              <select v-model="form.type" class="input" required>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label class="block text-sm">Amount</label>
              <input
                v-model.number="form.amount"
                type="number"
                step="0.01"
                class="input"
                required
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm">Category</label>
              <select v-model="form.category_id" class="input">
                <option :value="null">— None —</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm">Notes</label>
              <textarea v-model="form.notes" class="input" rows="3" />
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-2">
            <button class="btn-ghost" @click="close">Cancel</button>
            <button class="btn-primary" @click="save">Save</button>
          </div>
        </form>
      </dialog>
    </teleport>
  </section>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  border: none;
  padding: 0;
}
.modal::backdrop {
  background: rgba(0, 0, 0, 0.7);
}
</style>
