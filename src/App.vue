<template>

  <div id="app">
    <ul class='navbar'>
      <router-link class="navItem" to="/">Home</router-link>
      <router-link class="navItem" to="/registreren">Registreren</router-link>
      <router-link class="navItem" to="/mijnGegevens">Mijn Gegevens</router-link>
    </ul>

      <router-view></router-view>

  </div>
</template>

<script>



export default {
  name: "app",
  components: {
  },
  data() {
    return {
      loginRole: 'none', //voor later --> hangt af welke knoppen in navigatiebar en welke pagina's kunnen getoond worden (Login)
    };
  },
  methods: {
  
},

};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

ul.navbar {
  list-style: none; /* Remove bullet points */
  margin: 0;
  padding: 0;
  display: flex; /* Makes the nav horizontal */
  background-color: #333; /* Navbar background color */
  justify-content: center; /* Center items horizontally */
  align-items: center; /* Center items vertically */
}

/* Individual Nav Items */
.navItem {
  margin: 0 15px; /* Space between nav items */
  border: 1px;
  color: whitesmoke;
}

</style>
