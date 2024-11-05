import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        errors: {},
    }),
    actions: {

        /*** Get Authenticated User ***/
        async getUser(){
            if(localStorage.getItem('token')){
                const response = await axios.get('api/user',{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                })

                if(response.status === 200){
                    this.user = response.data;
                }
            }
        },

        /*** Login or Register User ***/
        async authenticate(apiRoute, formData) {
            await axios.post(`/api/${apiRoute}`, formData)
            .then(response => {
                // Handle successful response
                this.errors = {};
                localStorage.setItem('token', response.data.token);
                this.user = response.data.user;

                //redirect the user
                this.router.push({name: 'home'});
              })
              .catch(error => {
                if (error.response && error.response.status === 422) {
                  // Laravel validation failed
                  this.errors = error.response.data.errors;
                } else {
                  // Handle other errors
                  console.error('An error occurred:', error.message);
                }
              });
        },

        /*** Login or Register User ***/
        async logout(){
            await axios.post('/api/logout', {},  {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',

                }
            }).then((response) => {
                console.log('response', response);
                if(response.status === 200){
                    this.user = null;
                    this.errors = {};
                    localStorage.removeItem('token');
                    this.router.push({ name: 'home' })
                }
            }).catch((error) => {
                console.log('error', error);
            })
        }



        // async login(credentials){
        //     await axios.get('/sanctum/csrf-cookie'); // Initialize CSRF Token
        //     await axios.post('/login', credentials);
        //     await this.fetchUser();
        // },
        // async fetchUser() {
        //     const { data } = await axios.get('/api/user');
        //     this.user = data;
        // },
        // async logout() {
        //     await axios.post('/logout');
        //     this.user = null;
        // }
    }
});

