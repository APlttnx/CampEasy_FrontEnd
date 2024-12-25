<template>
    <div>
        <form>
            <div>
                <label for="login_email">Emailadres: </label>
                <input type="text" v-model="credentials.email" id="login_email">
            </div>
            <div>
                <label for="login_password">Wachtwoord: </label>
                <input type="password" v-model="credentials.password" id="login_password">
             </div>
             <button type="submit" @click="handleLogin()">Inloggen</button>
             <p v-if="error" class="error">{{ error }}</p>

        </form>
    </div>
  
  </template>
  <script>
  import { useUserStore } from '@/stores/userStore';

  export default {
    name: 'LoginPage',
    data() {
        return {
            credentials: {
                email: '',
                password: '',
            },
            error:'',
        };
    },
    methods: {
        async handleLogin() {
            const store = useUserStore();
            const success = await store.login(this.credentials);

            success ? this.$router.puch('/') : this.error = store.error;
        },
    },
    
    
    };
  
  </script>
  <style>
  
  </style>
  