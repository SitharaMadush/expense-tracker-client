<script setup>
import { storeToRefs } from 'pinia';
import HomeScreen from '../components/HomeScreen.vue';
import { useExpenseStore } from '@/stores/expense';
import { onMounted, ref } from 'vue';
// import DataTable from 'vue3-easy-data-table';
// import 'vue3-easy-data-table/dist/style.css';
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
  // console.log(expenses.value);
});

</script>

<template>
  <main>
    <h1 class="title">All Expenses</h1>
    <!-- <DataTable 
    :headers="headers"
    :items="items"
     /> -->

     <vue3-datatable :rows="rows" :columns="cols">
      <template #actions="data">
                <div class="d-flex space-x-2">
                    <button class="bg-blue-500 p-2 rounded text-white">View</button>
                    <button class="bg-red-500 p-2 rounded text-white">Edit</button>
                </div>            
                </template>
     </vue3-datatable>


    <!-- <div v-if="expenses && expenses.length">
      <div v-for="expense in expenses" :key="expense.id" class="border-l-4 border-blue-500 pl-4 mb-12">
        <h2 class="font-bold text-3xl">{{ expense.name }}</h2>
        <p class="text-xs text-slate-600 mb-4">Spent by {{ expense.user.name }}</p>
        <p>{{ expense.description }}</p>
      </div>
    </div>

    <div v-else>
      <h2>No Expenses to show</h2>
    </div> -->
  </main>
</template>
