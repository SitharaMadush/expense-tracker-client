<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

// Props expected:
// - items: Array<{ date, type: 'income'|'expense', amount, category_id? }>
// - categories: Array<{ id, name }>
const props = defineProps({
  items: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
  year: { type: Number, required: false }, // optional: filter to a specific year
})

// ---------- helpers ----------
const categoryNameById = computed(() => {
  const map = new Map()
  for (const c of props.categories || []) map.set(c.id, c.name || 'Unnamed')
  return map
})

const PALETTE = [
  '#2563eb','#16a34a','#f59e0b','#ef4444','#14b8a6',
  '#8b5cf6','#f97316','#06b6d4','#22c55e','#d946ef',
  '#4b5563','#84cc16','#e11d48','#0ea5e9','#a3e635'
]

function buildCategorySplit(type) {
  // Aggregate amounts by category for given type
  const byCat = new Map()
  for (const t of props.items || []) {
    if (!t || t.type !== type) continue
    // optional year filter, if provided
    if (props.year) {
      const y = new Date(t.date).getFullYear()
      if (Number.isFinite(y) && y !== props.year) continue
    }
    const amt = Number(t.amount || 0)
    if (!Number.isFinite(amt) || amt <= 0) continue

    const name = categoryNameById.value.get(t.category_id) || 'Uncategorized'
    byCat.set(name, (byCat.get(name) || 0) + amt)
  }

  const entries = [...byCat.entries()]
    .sort((a, b) => b[1] - a[1]) // largest first

  const labels = entries.map(([name]) => name)
  const data = entries.map(([, total]) => Number(total.toFixed(2)))

  // match color count to labels
  const backgroundColor = labels.map((_, i) => PALETTE[i % PALETTE.length])

  return { labels, data, backgroundColor }
}

const incomeSplit = computed(() => buildCategorySplit('income'))
const expenseSplit = computed(() => buildCategorySplit('expense'))

const incomeChartData = computed(() => ({
  labels: incomeSplit.value.labels,
  datasets: [{
    label: 'Income by Category',
    data: incomeSplit.value.data,
    backgroundColor: incomeSplit.value.backgroundColor,
    borderWidth: 1,
  }]
}))

const expenseChartData = computed(() => ({
  labels: expenseSplit.value.labels,
  datasets: [{
    label: 'Expense by Category',
    data: expenseSplit.value.data,
    backgroundColor: expenseSplit.value.backgroundColor,
    borderWidth: 1,
  }]
}))

const baseOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: true, text: title },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const val = Number(ctx.parsed).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          // percentage of total
          const total = ctx.dataset.data.reduce((s, n) => s + Number(n || 0), 0)
          const pct = total ? ((ctx.parsed / total) * 100).toFixed(1) : '0.0'
          return `${ctx.label}: ${val} (${pct}%)`
        }
      }
    }
  }
})

const incomeOptions = computed(() => baseOptions('Income by Category'))
const expenseOptions = computed(() => baseOptions('Expenses by Category'))
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2">
    <!-- Income Pie -->
    <div class="rounded-2xl border border-stone-200/60 p-4">
      <div class="h-80">
        <div v-if="incomeChartData.labels.length === 0" class="flex h-full items-center justify-center text-stone-500">
          No income data to display
        </div>
        <Pie v-else :data="incomeChartData" :options="incomeOptions" />
      </div>
    </div>

    <!-- Expense Pie -->
    <div class="rounded-2xl border border-stone-200/60 p-4">
      <div class="h-80">
        <div v-if="expenseChartData.labels.length === 0" class="flex h-full items-center justify-center text-stone-500">
          No expense data to display
        </div>
        <Pie v-else :data="expenseChartData" :options="expenseOptions" />
      </div>
    </div>
  </div>
</template>
