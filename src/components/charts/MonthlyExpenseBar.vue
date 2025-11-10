<script setup>
import { computed, watch, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'
import moment from 'moment'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

const props = defineProps({
  items: { type: Array, default: () => [] },    // transactions
  year:  { type: Number, default: () => Number(moment().format('YYYY')) },
  currency: { type: String, default: 'LKR' },
})

const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const monthlyTotals = computed(() => {
  const totals = Array(12).fill(0)
  for (const t of props.items || []) {
    if (!t?.date || t?.type !== 'expense') continue
    const m = moment(t.date, ['YYYY-MM-DD', moment.ISO_8601], true)
    if (!m.isValid() || m.year() !== props.year) continue
    totals[m.month()] += Number(t.amount || 0)
  }
  return totals;
});


const chartData = ref({
  labels,
  datasets: [
    {
      label: `Monthly Expenditure (${props.year})`,
      data: monthlyTotals.value,
      backgroundColor: (ctx) => {
        const { ctx: c, chartArea, chart } = ctx.chart
        if (!chartArea) return 'rgba(79, 70, 229, 0.8)' // first render
        const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0.9)')   // indigo-600
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.35)') // indigo-500/40
        return gradient
      },
      borderRadius: 10,
      borderSkipped: false,
      maxBarThickness: 36,
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: { color: '#475569' }, // slate-600
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: '#64748b',
        callback: (v) => new Intl.NumberFormat(undefined, { notation: 'compact' }).format(v),
      },
      grid: { color: 'rgba(148,163,184,0.2)' }, // slate-400/20
    },
  },
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Monthly Expenditure',
      color: '#8793a8', // slate-900
      font: { weight: '600', size: 16 },
      padding: { bottom: 10 },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const n = ctx.parsed.y || 0
          return `${new Intl.NumberFormat(undefined, { style: 'currency', currency: props.currency, maximumFractionDigits: 0 }).format(n)}`
        }
      }
    }
  }
})

watch(monthlyTotals, (vals) => {
  chartData.value = { ...chartData.value, datasets: [{ ...chartData.value.datasets[0], data: vals }] }
  console.log('monthlyTotals' ,monthlyTotals.value);

})
</script>

<template>
  <!-- container gives height for responsive=true -->
  <div class="h-64 md:h-80">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
