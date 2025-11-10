<script setup>
import { ref, computed, onMounted } from "vue";
import MonthlyExpenseBar from "@/components/charts/MonthlyExpenseBar.vue";
import api from "@/lib/api";
import TransactionCategoryPie from "../components/charts/TransactionCategoryPie.vue";
import PieChart from "../components/charts/PieChart.vue";

const items = ref([]);
const categories = ref([]);
const year = new Date().getFullYear();

const fetchList = async () => {
  const { data } = await api.get("/transactions");
  items.value = data.data ?? data;
};
const fetchCategories = async () => {
  const { data } = await api.get("/categories", { params: { per_page: 100 } });
  categories.value = data.data ?? data;
};

const categoryNameById = computed(() => {
  const map = new Map();
  for (const c of categories.value || []) map.set(c.id, c.name || "Unnamed");
  return map;
});

const PALETTE = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
  "#22c55e",
  "#d946ef",
  "#4b5563",
  "#84cc16",
  "#e11d48",
  "#0ea5e9",
  "#a3e635",
];

//  to be moved ----
const incomeData = computed(() => {
  // Aggregate amounts by category for given type
  const byCat = new Map();

  if (items.value.length === 0) {
    return { labels: [], data: [], backgroundColor: [] };
  } else {
    console.log('items*', items);
    
    for (const t of items.value) {
      if (!t || t.type !== "income") continue;
      // optional year filter, if provided
      if (year) {
        const y = new Date(t.date).getFullYear();
        if (Number.isFinite(y) && y !== year) continue;
      }
      const amt = Number(t.amount || 0);
      if (!Number.isFinite(amt) || amt <= 0) continue;

      const name = categoryNameById.value.get(t.category_id) || "Uncategorized";
      byCat.set(name, (byCat.get(name) || 0) + amt);
    }

    const entries = [...byCat.entries()].sort((a, b) => b[1] - a[1]); // largest first

    const labels = entries.map(([name]) => name);
    const data = entries.map(([, total]) => Number(total.toFixed(2)));

    // match color count to labels
    const backgroundColor = labels.map((_, i) => PALETTE[i % PALETTE.length]);

    return { labels, data, backgroundColor };
  }
});

const expenseData = computed(() => {
  // Aggregate amounts by category for given type
  const byCat = new Map();
  if (items.value.length === 0) {
    return { labels: [], data: [], backgroundColor: [] };
  } else {
    for (const t of items.value || []) {
      if (!t || t.type !== "expense") continue;
      // optional year filter, if provided
      if (year) {
        const y = new Date(t.date).getFullYear();
        if (Number.isFinite(y) && y !== year) continue;
      }
      const amt = Number(t.amount || 0);
      if (!Number.isFinite(amt) || amt <= 0) continue;

      const name = categoryNameById.value.get(t.category_id) || "Uncategorized";
      byCat.set(name, (byCat.get(name) || 0) + amt);
    }

    const entries = [...byCat.entries()].sort((a, b) => b[1] - a[1]); // largest first

    const labels = entries.map(([name]) => name);
    const data = entries.map(([, total]) => Number(total.toFixed(2)));

    // match color count to labels
    const backgroundColor = labels.map((_, i) => PALETTE[i % PALETTE.length]);

    return { labels, data, backgroundColor };
  }
});

// -----------

onMounted(() => Promise.all([fetchList(), fetchCategories()]));
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="card flex flex-col md:flex-row gap-2">
      <PieChart
        :data="incomeData"
        :categories="categories"
        label="Income by Category"
        transcationType="income"
      />
      <PieChart
        :data="expenseData"
        :categories="categories"
        label="Expense by Category"
        transcationType="expense"
      />
      <!-- <TransactionCategoryPie :items="items" :categories="categories" /> -->
    </div>
    <div class="card">
      <MonthlyExpenseBar :items="items" :currency="'LKR'" />
    </div>
  </div>
</template>
