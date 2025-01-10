<template>
<!-- Arnout Plettinx  -->
  <div id="app">
    <header>
    <img class="headerPicture" src="./assets/headerAfb.jpg" alt="forest"/>
      <nav>
        <router-link class="navItem" to="/">CampEasy</router-link>
        <router-link v-if="!isAuthenticated" class="navItem" to="/login">Aanmelden</router-link>
        <router-link v-if="!isAuthenticated" class="navItem" to="/registreren">Registreren</router-link>
        <router-link v-if="isAuthenticated" class="navItem" to="/mijnGegevens">Mijn Gegevens</router-link>
        <router-link v-if="isAuthenticated" class="navItem" to="/overzichtBoekingen">Mijn Boekingen</router-link>
        <router-link v-if="isAuthenticated && this.userStore.currentUserRole == 'owner'" class="navItem" to="/mijnCampings">Mijn Campings</router-link>
        <router-link v-if="isAuthenticated" class="navItem" to="/campingAanmaken">Camping Aanmaken</router-link>
        <a v-if="isAuthenticated" @click="logout()" class="navItem" href="#">Afmelden</a>
      </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { useUserStore } from './stores/userStore';
import { useCampingStore } from './stores/campingStore';
import { mapStores } from 'pinia';

export default {
  name: "app",
  
  methods: {
    logout() {
      this.userStore.logout();
      this.campingStore.logout();
      this.$router.push('/');
      
    },
  },
  computed: {
    ...mapStores(useUserStore, useCampingStore),
    isAuthenticated() {
      return this.userStore.isAuthenticated;
    },
  },
};
</script>

<style>

</style>
