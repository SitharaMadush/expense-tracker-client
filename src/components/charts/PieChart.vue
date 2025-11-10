<script setup>
import { computed } from "vue";
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Props expected:
const props = defineProps({
  label: { type: String, default: "Pie Chart" },
  transcationType: { type: String, default: "pie-chart" },
  data: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
  year: { type: Number, required: false }, // optional: filter to a specific year
});

const ChartData = computed(() => ({
  labels: props.data.labels,
  datasets: [
    {
      label: props.label,
      data: props.data.data,
      backgroundColor: props.data.backgroundColor,
      borderWidth: 1,
    },
  ],
}));

const baseOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
    title: {
      display: true,
      text: title,
      color: "#8793a8",
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const val = Number(ctx.parsed).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          // percentage of total
          const total = ctx.dataset.data.reduce(
            (s, n) => s + Number(n || 0),
            0
          );
          const pct = total ? ((ctx.parsed / total) * 100).toFixed(1) : "0.0";
          return `${ctx.label}: ${val} (${pct}%)`;
        },
      },
    },
  },
});

const options = computed(() => baseOptions(props.label));
</script>

<template>
  <div class="flex w-full justify-around">
    <div class="rounded-2xl w-full p-4">
      <div class="h-80">
        <div
          v-if="ChartData.labels.length === 0"
          class="flex h-full items-center justify-center text-stone-500"
        >
          No data to display
        </div>
        <Pie v-else :data="ChartData" :options="options" />
      </div>
    </div>
  </div>
</template>
