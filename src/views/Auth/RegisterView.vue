<script setup>
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { onMounted, reactive } from 'vue';

const { authenticate } = useAuthStore();
const { errors} = storeToRefs(useAuthStore());

onMounted(() => {
    errors.value = {};
})


const formData = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',

});
const handleRegister = () => {
        authenticate('register', formData);
    }


</script>

<template>
  <main>
    <h1 class="title">Register a new account</h1>

    <form @submit.prevent="handleRegister" class="w-1/2 mx-auto space-y-6" action="">
        <div>
            <input type="text" v-model="formData.name" placeholder="Name">
            <p v-if="errors.name" class="error">{{ errors.name[0] }}</p>
        </div>        
        <div>
            <input type="text" v-model="formData.email" placeholder="Email">
            <p v-if="errors.email" class="error">{{ errors.email[0] }}</p>

        </div>        
        <div>
            <input type="password"  v-model="formData.password" placeholder="Password">
            <p v-if="errors.password" class="error">{{ errors.password[0] }}</p>
        </div>        
        <div>
            <input type="password"  v-model="formData.password_confirmation" placeholder="Confirm Password">
        </div>        
        <button class="primary-btn">Register</button>
    </form>
  </main>
</template>
