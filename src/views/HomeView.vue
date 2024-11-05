<script setup>
import { storeToRefs } from 'pinia';
import HomeScreen from '../components/HomeScreen.vue';
import { useExpenseStore } from '@/stores/expense';
import { onMounted, ref } from 'vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css'
;


const { getAllExpenses } = useExpenseStore();
const { expenses } = storeToRefs(useExpenseStore());

const cols = ref([
      { field: "id", title: "ID", filter: false },
      { field: "name", title: "Name" },
      { field: "amount", title: "Amount" },
      { field: "description", title: "Description" },
      { field: "date", title: "Date", type: "date", width: "120px", },
      { field: "user.name", title: "Created By" },
      { field: "user.name", title: "Updated By" },
      { field: "actions", title: "Action", width: "150" },
])

const rows = expenses;


onMounted(async () => { 
  await getAllExpenses();
});

</script>

<template>
  <main>
    <h1 class="title">All Expenses</h1>

     <vue3-datatable :rows="rows" :columns="cols">
      <template #actions="data">
                <div class="d-flex space-x-2">
                    <button class="bg-blue-500 p-2 rounded text-white">View</button>
                    <button class="bg-red-500 p-2 rounded text-white">Edit</button>
                </div>            
                </template>
     </vue3-datatable>

  </main>
</template>
