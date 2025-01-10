<template>
    <div>
      <label for="input_country">Land: </label>
      <input type="text" :value="modelValue" list="countryList" @input="onInputChange"  >
      <datalist id="countryList">
        <option v-for="country in countries" :key="country" :value="country" />
      </datalist>
      <p v-if="error" class="error">Ongeldige invoer. Kies een geldige land.</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      modelValue: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        countries: [],
        error: false,
      };
    },
    watch: {
      country(newValue) {
        this.validateCountry(newValue);
      },
    },
    created() {
      this.fetchCountries();
    },
    methods: {
      async fetchCountries() {
        try {
          const response = await fetch('https://restcountries.com/v3.1/all');
          const countries = await response.json();
          this.countries = countries.map(
            country => country.translations.nld?.common || country.name.common,
          );
        } catch (error) {
          console.error('Failed to fetch countries:', error);
        }
      },
      onInputChange(event) {
        this.$emit('update:modelValue', event.target.value); // Emit the updated value
        this.validateCountry(event.target.value); // Validate country
      },
      validateCountry(country) {
        this.error = !this.countries.includes(country);
      },
    },
  };
  </script>
  
  <style scoped>
 
  </style>
  