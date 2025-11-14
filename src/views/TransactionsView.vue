<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "@/lib/api";
import moment from "moment";

const items = ref([]);
const categories = ref([]);

const page = ref(1);
const meta = ref({ total: 0, per_page: 15, current_page: 1, last_page: 1 });

const filters = reactive({
  q: "",
  type: "",
  from: "",
  to: "",
  per_page: 10,        // page size
  sort_by: "date",     // default sort
  sort_dir: "desc",    // 'asc' | 'desc'
});

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
  const params = { ...filters, page: page.value };
  const { data } = await api.get("/transactions", { params });

  if (Array.isArray(data)) {
    items.value = data;
    meta.value = { total: data.length, per_page: data.length, current_page: 1, last_page: 1 };
  } else if (data?.data) {
    items.value = data.data;
    const m = data.meta || data;
    meta.value = {
      total: m.total ?? items.value.length,
      per_page: m.per_page ?? filters.per_page,
      current_page: m.current_page ?? page.value,
      last_page: m.last_page ?? 1,
    };
  } else {
    items.value = data;
    meta.value = { total: items.value?.length ?? 0, per_page: filters.per_page, current_page: 1, last_page: 1 };
  }
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
  Object.assign(form, t, { category_id: t.category_id ?? t.category?.id ?? null });
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

// debounce + reset to page 1 when filters change
const debouncedFetch = (() => {
  let h;
  return () => {
    clearTimeout(h);
    h = setTimeout(() => { page.value = 1; fetchList(); }, 350);
  };
})();

function go(n) {
  const next = Math.min(Math.max(1, n), meta.value.last_page);
  if (next !== page.value) {
    page.value = next;
    fetchList();
  }
}

function setSort(column) {
  if (filters.sort_by === column) {
    filters.sort_dir = filters.sort_dir === "asc" ? "desc" : "asc";
  } else {
    filters.sort_by = column;
    filters.sort_dir = "asc";
  }
  page.value = 1;
  fetchList();
}

// optional helpers for range text
const showingFrom = () => (meta.value.per_page * (meta.value.current_page - 1)) + (items.value.length ? 1 : 0);
const showingTo = () => (meta.value.per_page * (meta.value.current_page - 1)) + items.value.length;

onMounted(() => Promise.all([fetchList(), fetchCategories()]));
</script>


<template>
  <section class="space-y-6">
    <!-- filters ... (unchanged) -->

    <div class="card overflow-hidden p-0">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-slate-700">
          <tr class="text-left text-xs font-semibold text-slate-50 uppercase tracking-wider">
            <th class="px-4 py-3 cursor-pointer select-none" @click="setSort('date')">
              Date
              <span v-if="filters.sort_by==='date'"> {{ filters.sort_dir==='asc' ? '▲' : '▼' }} </span>
            </th>
            <th class="px-4 py-3 cursor-pointer select-none" @click="setSort('title')">
              Title
              <span v-if="filters.sort_by==='title'"> {{ filters.sort_dir==='asc' ? '▲' : '▼' }} </span>
            </th>
            <th class="px-4 py-3 cursor-pointer select-none" @click="setSort('type')">
              Type
              <span v-if="filters.sort_by==='type'"> {{ filters.sort_dir==='asc' ? '▲' : '▼' }} </span>
            </th>
            <th class="px-4 py-3 cursor-pointer select-none" @click="setSort('amount')">
              Amount
              <span v-if="filters.sort_by==='amount'"> {{ filters.sort_dir==='asc' ? '▲' : '▼' }} </span>
            </th>
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
                <span class="inline-block size-3 rounded-full" :style="{ background: t.category.color }"></span>
                {{ t.category.name }}
              </span>
              <span v-else class="text-gray-400">—</span>
            </td>
            <td class="flex gap-2 justify-end px-4 py-3">
              <button class="btn bg-emerald-500 hover:bg-emerald-700 text-slate-50 hover:shadow-xl" @click="edit(t)">Edit</button>
              <button class="btn bg-red-500 hover:bg-red-700 text-slate-50 hover:shadow-xl" @click="removeTx(t)">Delete</button>
            </td>
          </tr>

          <tr v-if="!items.length">
            <td colspan="6" class="px-4 py-10 text-center text-gray-500">No results</td>
          </tr>
        </tbody>
      </table>

      <!-- DataTable footer: page size + pager + range -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-3 p-4">
        <div class="flex items-center gap-2 text-sm">
          <span>Rows per page:</span>
          <select
            class="input !py-1"
            v-model.number="filters.per_page"
            @change="() => { page = 1; fetchList(); }"
          >
            <option :value="10">10</option>
            <option :value="15">15</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>

        <div class="text-sm text-gray-600">
          Showing {{ showingFrom() }}–{{ showingTo() }}
          <span v-if="meta.total"> of {{ meta.total }}</span>
        </div>

        <div class="flex items-center gap-2">
          <button class="btn-ghost" :disabled="meta.current_page<=1" @click="go(1)">« First</button>
          <button class="btn-ghost" :disabled="meta.current_page<=1" @click="go(meta.current_page-1)">‹ Prev</button>
          <span class="px-2 text-sm">Page {{ meta.current_page }} / {{ meta.last_page }}</span>
          <button class="btn-ghost" :disabled="meta.current_page>=meta.last_page" @click="go(meta.current_page+1)">Next ›</button>
          <button class="btn-ghost" :disabled="meta.current_page>=meta.last_page" @click="go(meta.last_page)">Last »</button>
        </div>
      </div>
    </div>

    <!-- dialog code stays the same ... -->
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
