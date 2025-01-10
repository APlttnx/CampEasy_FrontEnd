<template>
  <div>

    <form>
      <h1>Welkom</h1>
      <div>
        <label for="input_fn">Voornaam:* </label>
        <input type="text" v-model="user.fn" id="input_fn" required maxlength="50">
      </div>
      <div>
        <label for="input_ln">Achternaam:* </label>
        <input type="text" v-model="user.ln" id="input_ln" required maxlength="50">
      </div>
      <div>
        <label for="input_pn">Voorkeursnaam: </label>
        <input type="text" v-model="user.pn" id="input_pn" maxlength="50">
      </div>
      <div>
        <label for="input_email">Email:* </label>
        <input type="email" v-model="user.email" id="input_email" required maxlength="100">
      </div>
      <div>
        <label for="input_phoneNumber">Telefoonnummer: </label>
        <input type="text" v-model="user.phoneNumber" id="input_phoneNumber" maxlength="20">
      </div>
      <div class="inlineGroup">
        <div class="large">
          <label for="input_street">Straat: </label>
          <input type="text" v-model="user.street" id="input_street" maxlength="100">
        </div>
        <div class="small">
          <label for="input_streetnr">Nr: </label>
          <input type="number" v-model="user.streetnr" id="input_streetnr" maxlength="10">
        </div>
      </div>
      <div class="inlineGroup">
        <div class="small">
          <label for="input_postcode">Postcode: </label>
          <input type="text" v-model="user.postcode" id="input_postcode" maxlength="5">
        </div>
        <div class="large">
          <label for="input_town">Gemeente: </label>
          <input type="text" v-model="user.town" id="input_town" maxlength="85">
        </div>
      </div>
      <div>
        <countrySelector v-model="user.country" id="input_country" />
      </div>
      <div>
        <label for="input_emergencyTelnr">Noodgeval nummer: </label>
        <input type="text" v-model="user.emergencyTelnr" id="input_emergencyTelnr" maxlength="20">
      </div>
      <div>
        <label for="input_password">Wachtwoord:* </label>
        <input type="password" v-model="user.password" id="input_password" required minlength="8">
      </div>
      <div>
        <label for="input_checkPassword">Bevestiging wachtwoord:* </label>
        <input type="password" v-model="user.checkPassword" id="input_checkPassword" required minlength="8">
      </div>
      <p class="errorMessage">{{ regError }}</p>
      <div>
        <button type="submit" @click="submitUser()">Registreren</button>
      </div>
    </form>


  </div>

</template>
<script>
import countrySelector from '@/components/countrySelector.vue';
import { useUserStore } from '@/stores/userStore';
export default {
  name: 'RegisterPage',
  created() {
    const userStore = useUserStore();
    const lastRoute = localStorage.getItem('lastVisitedRoute') || '/';
    console.log(userStore.isAuthenticated);
    userStore.isAuthenticated ? this.$router.push(lastRoute) : true;
  },
  data() {
    return {
      user: {
        role: "user",
        fn: '',
        ln: '',
        pn: '',
        email: '',
        phoneNumber: '',
        street: '',
        streetnr: '',
        postcode: '',
        town: '',
        country: '',
        emergencyTelnr: '',
        password: '',
        checkPassword: '',
      },
      regError: '',
    };
  },
  components: {
    countrySelector,
  },
  computed: {
    userData() {
      return {
        firstName: this.user.fn.trim(),
        lastName: this.user.ln.trim(),
        preferredName: this.user.pn.trim(),
        roleUser: this.user.role.trim(),
        email: this.user.email.trim(),
        phoneNumber: this.user.phoneNumber.trim(),
        address: `${this.user.street.trim()} | ${this.user.streetnr} | ${this.user.postcode.trim()} | ${this.user.town.trim()}`,
        country: this.user.country.trim(),
        emergencyTel: this.user.emergencyTelnr.trim(),
        password: this.user.password.trim(),
      };

    },
  },

  methods: {
    submitUser() {

      if (!this.userData.firstName || !this.userData.lastName || !this.userData.email || !this.userData.password || !this.user.checkPassword) {
        console.log('test');
        throw "Niet alle verplichte velden zijn ingevuld test";
      }
      //gelijkaardige check -> programma crasht als je trim doet op leeg veld, dus eerst check of leeg, dan check voor enkel spaties
      if (!this.user.fn.trim() || !this.user.ln.trim() || !this.user.email.trim() || !this.user.password.trim()) {
        this.regError = "Niet alle verplichte velden zijn ingevuld";
        return;
      }

      // wachtwoorden gelijk?
      if (this.userData.password !== this.user.checkPassword) {
        throw "wachtwoord is niet gelijk";
      }

      fetch("http://localhost:3100/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.userData),
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
          }
          return response.json();
        })
        .then(data => {
          // Handle success
          console.log('Success:', data);
          this.$router.push('/login');
        })
        .catch(error => {
        // Check for specific errors and display an appropriate message
        if (error.error === "Email already in use") {
          this.regError = "Dit e-mailadres is al in gebruik";
        } else {
          this.regError = "Er is een fout opgetreden tijdens de registratie";
        }
        console.error(error);
        });
    },
  },
};
</script>
<style>

</style>