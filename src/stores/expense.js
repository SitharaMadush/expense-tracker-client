import { defineStore } from "pinia";
import axios from "axios";


export const useExpenseStore = defineStore('expenseStore', { 
    state: () => ({
       errors: null,
       expenses: null,
       formData: {
            name: '',
            amount: '',
            description: '',
            date: '',
        }
    }),
    actions: {
        /*** Get all Expenses ***/
        async getAllExpenses(){
            const response = await axios.get('/api/expenses', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if(response.status === 200){
                this.expenses = response.data;
            }
        },

        /*** Create an Expense ***/
        async createExpense(formData){

            try{
                const response = await axios.post('/api/expenses', this.formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.errors = {};
                this.router.push({ name: 'home' });

                this.formData = {
                    name: '',
                    amount: '',
                    description: '',
                    date: '',
                }

            }catch(error){
                if(error.status === 422){
                    this.errors = error.response.data.errors;
                }else{
                    console.log(error);

                }
            }
        }
    }
});