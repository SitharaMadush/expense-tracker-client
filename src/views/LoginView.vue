<script setup>
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { onMounted, reactive } from 'vue';

const { authenticate } = useAuthStore();
const { errors} = storeToRefs(useAuthStore());


const formData = reactive({
    email: '',
    password: '',
});

onMounted(() => {
    errors.value = {};
})
const handleRegister = () => {
        authenticate('login', formData);
    }


</script>

<template>
  <main>
    <h1 class="title">Login to your account</h1>

    <form @submit.prevent="handleRegister" class="w-1/2 mx-auto space-y-6" action="">
     
        <div>
            <input type="text" v-model="formData.email" placeholder="Email">
            <p v-if="errors.email" class="error">{{ errors.email[0] }}</p>
        </div>        
        <div>
            <input type="password"  v-model="formData.password" placeholder="Password">
            <p v-if="errors.password" class="error">{{ errors.password[0] }}</p>
        </div>               
        <button class="primary-btn">Login</button>
    </form>
  </main>
</template>
