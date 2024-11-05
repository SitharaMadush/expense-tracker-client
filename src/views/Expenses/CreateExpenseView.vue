<script setup>

import { useExpenseStore } from  '@/stores/expense';
import { storeToRefs } from 'pinia';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';


const { createExpense } = useExpenseStore();

const { errors, formData } = storeToRefs(useExpenseStore());


</script>

<template>
    <main>
        <h1 class="title">Create Expense</h1>

        <form @submit.prevent="createExpense" class="w-1/2 mx-auto space-y-6">
            <div>
                <input v-model="formData.name" type="text" placeholder="Name">
                <p v-if="errors && errors.name" class="error">{{ errors.name[0] }}</p>
            </div>

            <div>
                <input v-model="formData.amount" type="text" placeholder="Amount">
                <p v-if="errors && errors.amount" class="error">{{ errors.amount[0] }}</p>
            </div>

            <div>
                <textarea v-model="formData.description" rows="6" placeholder="Description"></textarea>
                <p v-if="errors && errors.description" class="error">{{ errors.description[0] }}</p>
            </div>


            <div>
                <Datepicker 
                    format="yyyy-MM-dd" 
                    :enable-time-picker="false"
                    model-type="yyyy-MM-dd"
                    v-model="formData.date" />
                <!-- <input v-model="formData.date" type="text" placeholder="Date"> -->
                <p v-if="errors && errors.date" class="error">{{ errors.date[0] }}</p>
            </div>

            <button class="primary-btn">Create</button>
        </form>
    </main>
</template>