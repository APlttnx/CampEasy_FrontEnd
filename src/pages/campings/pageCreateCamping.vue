<template>
  <div>
    <form>
      <div class="inputform">
        <label for="input_name">Benaming: </label>
        <input type="text" v-model="camping.name" id="input_name">
      </div>
      <div class="inputform">
        <label for="input_type">Type: </label>
        <select  v-model="camping.type" id="input_type">
          <option value="Tent">Tent</option>
          <option value="Caravan">Caravan</option>
        </select>
      </div>
      <div class="inputform">
        <label for="input_size">Grootte: </label>
        <input type="text" v-model="camping.size" id="input_size">
      </div>
      <div class="inputform">
        <label for="input_description">Omschrijving: </label>
        <textarea type="text" v-model="camping.description" id="input_description" maxlength="1000"></textarea>
      </div>
      <div class="inputform">
        <label for="input_price">Prijs per nacht: </label>
        <input type="text" v-model="camping.price" id="input_price">
      </div>
      <div class="inlineGroup">
        <div class="large">
          <label for="input_street">Straat: </label>
          <input type="text" v-model="camping.street" id="input_street">
        </div>
        <div class="small">
          <label for="input_streetnr">Nr: </label>
          <input type="text" v-model="camping.streetnr" id="input_streetnr">
        </div>
      </div>
      <div class="inlineGroup">
        <div class="small">
          <label for="input_postcode">Postcode: </label>
          <input type="text" v-model="camping.postcode" id="input_postcode">
        </div>
        <div class="large">
          <label for="input_town">Gemeente: </label>
          <input type="text" v-model="camping.town" id="input_town">
        </div>
      </div>
      <div class="inputform">
        <countrySelector v-model="camping.country"  id="input_country"/>
      </div>
      <label>Faciliteiten:</label>
      <div v-for="facility in this.facilities" :key="facility.ID">
        <label>
          <input type="checkbox" :value="facility.ID" v-model="selectedFacilities" />
          {{ facility.facilityName }}
        </label>
      </div>

      <div class="inputform">
        <label>Afbeeldingen: </label>
        <imageUpload v-model:images="images" />
      </div>
      <div class="inlineGroup">
        <button type="submit" @click="clearForm()">Annuleren</button>
        <button type="submit" @click="submitCamping()">Aanmaken</button>
      </div>
    </form>
  </div>
</template>
<script>
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { useFacilityStore } from '@/stores/facilityStore';
import { useCampingStore } from '@/stores/campingStore';
import { delay } from '@/shared/formatters';
// import { mapStores } from 'pinia';
import imageUpload from '@/components/imageUpload.vue';
import countrySelector from '@/components/countrySelector.vue';
export default {
  name: 'CreateCampingPage',
  components: {
    imageUpload,
    countrySelector,
  },
  mounted() {
    this.fetchFacilities();
  },
  data() {
    return {
      camping: {
        name: '',
        type: '',
        size: '',
        price: '',
        description: '',
        street: '',
        streetnr: '',
        postcode: '',
        town: '',
        country: '',
      },
      images: [],
      facilities: [],
      selectedFacilities: [],
    };

  },
  computed: {
    ...mapStores(useUserStore, useFacilityStore, useCampingStore),
    campingData() {
      return {
        name: this.camping.name,
        type: this.camping.type,
        size: this.camping.size,
        price: this.camping.price,
        description: this.camping.description,
        address: `${this.camping.street} | ${this.camping.streetnr} | ${this.camping.postcode} | ${this.camping.town}`,
        country: this.camping.country,
        images: this.images,
        facilities: this.selectedFacilities,
      };
    },
  },

  methods: {
    async fetchFacilities() {
      await this.facilityStore.fetchFacilities();
      if (this.facilityStore.facilities) {
        this.facilities = { ...this.facilityStore.facilities };
      }
    },
    async submitCamping() {
      //failsave als logout terwijl op pagina
      if (!this.userStore.token) {
        console.log("no user logged in");
        this.$router.push('/login');
        return false;
      }
      const dataToSend = {
        ...this.campingData,
        userRole: this.userStore.currentUserRole,
      };

      await fetch("http://localhost:3100/api/camping", {
        method: "POST",
        headers: {
          'authorization': `Bearer ${this.userStore.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
          }
          return response.json();
        })
        .then(() => {
          this.campingStore.fetchCampings(); 
          this.userStore.currentUserRole = 'owner'; 
        })
        .then(data => {
          console.log('Success:', data);
          delay(500);
          this.clearForm();
          this.$router.push('/mijnCampings');
        })
        .catch(error => {
          // Handle error
          console.error('Error:', error);
        });

    },
    clearForm() {
      this.camping = {
        name: '',
        type: '',
        size: '',
        price: '',
        description: '',
        street: '',
        streetnr: '',
        postcode: '',
        town: '',
        country: '',
        
      };
      this.images = [];
      this.selectedFacilities = [];
      this.$router.push('/');
    },
  },
};
</script>
<style></style>