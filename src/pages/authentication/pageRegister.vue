<template>
  <div class="formblock">

    <form>
      <h1>Welkom</h1>
      <div>
        <label for="input_fn">Voornaam*: </label>
        <input type="text" v-model="user.fn" id="input_fn">
      </div>
      <div>
        <label for="input_ln">Achternaam*: </label>
        <input type="text" v-model="user.ln" id="input_ln">
      </div>
      <div>
        <label for="input_pn">Voorkeursnaam: </label>
        <input type="text" v-model="user.pn" id="input_pn">
      </div>
      <div>
        <label for="input_email">Email*: </label>
        <input type="text" v-model="user.email" id="input_email">
      </div>
      <div>
        <label for="input_phoneNumber">Telefoonnummer*: </label>
        <input type="text" v-model="user.phoneNumber" id="input_phoneNumber">
      </div>
      <div class="inline-group">
        <div class="large">
          <label for="input_street">Straat: </label>
          <input type="text" v-model="user.street" id="input_street">
        </div>
        <div class="small">
          <label for="input_streetnr">Nr: </label>
          <input type="text" v-model="user.streetnr" id="input_streetnr">
        </div>
      </div>
      <div class="inline-group">
        <div class="small">
          <label for="input_postcode">Postcode: </label>
          <input type="text" v-model="user.postcode" id="input_postcode">
        </div>
        <div class="large">
          <label for="input_town">Gemeente: </label>
          <input type="text" v-model="user.town" id="input_town">
        </div>
      </div>
      <div>
        <countrySelector v-model="user.country"  id="input_country"/>
      </div>
      <div>
        <label for="input_emergencyTelnr">Noodgeval nummer: </label>
        <input type="text" v-model="user.emergencyTelnr" id="input_emergencyTelnr">
      </div>
      <div>
        <label for="input_password">Wachtwoord*: </label>
        <input type="password" v-model="user.password" id="input_password">
      </div>
      <div>
        <label for="input_checkPassword">Bevestiging wachtwoord:* </label>
        <input type="password" v-model="user.checkPassword" id="input_checkPassword">
      </div>
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
        console.log(userStore.isAuthenticated );
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
    };
  },
  components: {
    countrySelector,
  },
  computed: {
    // fullAddress() {
    //   return `${this.user.street} | ${this.user.streetnr} | ${this.user.postcode} | ${this.user.town}`;
    // },
    
    userData() {
      return {
        firstName: this.user.fn,
        lastName: this.user.ln,
        preferredName: this.user.pn,
        roleUser: this.user.role,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber,
        address: `${this.user.street} | ${this.user.streetnr} | ${this.user.postcode} | ${this.user.town}`,
        country: this.user.country,
        emergencyTel: this.user.emergencyTelnr,
        password: this.user.password,
      };
      
    },
  },

  methods: {
    submitUser() {
      // wachtwoorden gelijk?
      if (this.user.password !== this.user.checkPassword) {
        alert('Passwords do not match!');
        return;
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
          // Handle error
          console.error('Error:', error);
        });
    },
  },
};
</script>
<style>
form {
  background-color: #ffffff8e;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  margin: auto;
}

form div {
  margin-bottom: 12px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 1px;
}

input[type="text"],
input[type="password"],
button {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

button {
  background-color: #5a9;
  color: #fff;
  border: none;
  font-weight: bold;
  cursor: pointer;
  padding: 10px;
}

button:hover {
  background-color: #4a8;
}

button:disabled {
  cursor: not-allowed;
}

.btn-disabled {
  background-color: transparent;  
  color: #bdc3c7;                
  border: 1px solid #bdc3c7;       
}

.inline-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.inline-group .small {
  flex: 1;
}

.inline-group .large {
  flex: 3;
}


form h1 {
  margin-top: 5px;
  text-align: center;
}
</style>