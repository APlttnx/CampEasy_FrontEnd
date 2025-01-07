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
  import { mapStores } from 'pinia';
  export default {
    name: 'LoginPage',
    created() {
        this.userStore.isAuthenticated ? this.$router.push(this.lastRoute) : true;
    },
    data() {
        return {
            credentials: {
                email: '',
                password: '',
            },
            error:'',
        };
    },
    computed: {
        ...mapStores(useUserStore),
        lastRoute() {
            let lastRoute = localStorage.getItem('lastVisitedRoute') || '/';
            lastRoute = lastRoute == '/registreren' ? '/' : lastRoute;
            return lastRoute;
        },
    },
    methods: {
        async handleLogin() {
            const success = await this.userStore.login(this.credentials);
            console.log(success);
            console.log(this.lastRoute);
            success ? this.$router.push(this.lastRoute) : this.error = this.userStore.error;
        },
    },
    };
  
  </script>
  <style>
  
  </style>
  