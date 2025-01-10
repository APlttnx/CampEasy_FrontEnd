<template>

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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;

}
body {
  background: #123524;
  background-attachment: fixed;
  padding: 0px;
  margin: 0px;
}

header {
  background-color: #3E7B27;
  margin: 0;

}

main {
  margin: 0 auto;
  padding: 30px;
  background-color: #EFE3C2;
  min-height: 700px;
  margin-left: 10%;
  margin-right: 10%;
}


nav {
  list-style: none;
  margin: 0;
  padding: 8px;
  display: flex;
  background-color: #123524;
  justify-content: center; 
  align-items: center; 
  height: 30px;
}

.navItem {
  margin: 0 15px; 
  color: #EFE3C2;
  text-decoration: underline;
}

.router-link-active{
  color: rgba(252, 151, 84, 0.959)
}

.headerPicture {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  object-fit: cover;
}

.column {
  float: left;
  width: 10%;
}

.column.center {
  float: left;
  width: 80%;
}

</style>
