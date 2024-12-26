<template>
  <div>
      <h1>Welcome</h1>
      <form>
          <div>Welke rol*: 
            <label for="input_user">Gebruiker: </label>
            <input type="radio" v-model="user.role" id="input_user" value="user">
            <label for="input_owner">Eigenaar: </label>
            <input type="radio" v-model="user.role" id="input_owner" value="owner">
          </div>
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
          <div>
            <label for="input_street">Straat: </label>
            <input type="text" v-model="user.street" id="input_street">

            <label for="input_streetnr">Nr: </label>
            <input type="text" v-model="user.streetnr" id="input_streetnr">
          </div>
          <div>
            <label for="input_postcode">Postcode: </label>
            <input type="text" v-model="user.postcode" id="input_postcode">

            <label for="input_town">Gemeente: </label>
            <input type="text" v-model="user.town" id="input_town">
          </div>
          <div>
            <label for="input_country">Land: </label>
            <input type="text" v-model="user.country" id="input_country">
          </div>
          <div>
            <label for="input_emergencyTelnr">Noodgeval nummer: </label>
            <input type="text" v-model="user.emergencyTelnr" id="input_emergencyTelnr"/>
          </div>
          <div>
            <label for="input_password">Wachtwoord*: </label>
            <input type="text" v-model="user.password" id="input_password">
          </div>
          <div>
            <label for="input_checkPassword">Bevestiging wachtwoord:* </label>
            <input type="text" v-model="user.checkPassword" id="input_checkPassword">
          </div>
          <div>
            <button type="submit" @click="submitUser()">Registreren</button>
          </div>
      </form>


  </div>

</template>
<script>
export default {
name: 'RegisterPage',
data() {
  return {
    user: {
      role: '',
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
      address: this.fullAddress,
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
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(this.userData), // Remove the name wrapper
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
        // Maybe redirect or show success message
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
        // Show error message to user
      });
    },
  },
};
</script>
<style>

</style>
