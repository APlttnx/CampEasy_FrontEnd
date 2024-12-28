<template>

  <div id="app">
    <header>
    <img class="headerPicture" src="./assets/jpg/headerAfb.jpg" alt="forest"/>
      <nav>
        <router-link class="navItem" to="/">Home</router-link>
        <router-link v-if="!isAuthenticated" class="navItem" to="/login">Aanmelden</router-link>
        <router-link v-if="!isAuthenticated" class="navItem" to="/registreren">Registreren</router-link>
        <router-link v-if="isAuthenticated" class="navItem" to="/mijnGegevens">Mijn Gegevens</router-link>
        <router-link v-if="isAuthenticated" @click="logout()" class="navItem" to="/">Afmelden</router-link>
      </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { useUserStore } from './stores/userStore';


export default {
  name: "app",
  components: {
  },
  data() {
    return {
      
    };
  },
  methods: {
    logout() {
      const userStore = useUserStore();
      userStore.logout();
    },
  },
  computed: {
    isAuthenticated() {
      const userStore = useUserStore();
      return userStore.isAuthenticated;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;

}
body {
  background: linear-gradient(to bottom, #3E7B27, #85A947);
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
  margin-left: 7.5%;
  margin-right: 7.5%;
}


nav {
  list-style: none; /* Remove bullet points */
  margin: 0;
  padding: 8px;
  display: flex; /* Makes the nav horizontal */
  background-color: #123524; /* Navbar background color */
  justify-content: center; /* Center items horizontally */
  align-items: center; /* Center items vertically */
  height: 30px;
}

/* Individual Nav Items */
.navItem {
  margin: 0 15px; /* Space between nav items */
  border: 1px;
  color: #EFE3C2;
}

.headerPicture {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  object-fit: cover;
}

</style>
