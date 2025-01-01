<template>
    <div class="camping-card" @click="navigateToDetails">
      <div class="image-camping">

        <img :src="camping.image || require('@/assets/headerAfb.jpg')" alt="Camping Image" />

      </div>
      <div class="info">
        <h3>{{ camping.name }}, {{ camping.town }}</h3>
        <p>{{ camping.size }} m²</p>
        <p>€ {{ camping.price }}/nacht</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CampingCard',
    props: {
        camping: {
        type: Object,
        required: true,
        validator(camping) {
          return camping.id && camping.name; 
        },
      },
    },
    

    methods: {
      navigateToDetails() {
        this.$router.push(`/camping/${this.camping.id}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .camping-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    max-width: 300px;
    min-width: 300px;
    margin: 20px;
  }
  .image-camping {
    position: relative;
    height: 200px;
    overflow: hidden;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  /* .carousel-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.5);
    border: none;
    cursor: pointer;
    font-size: 24px;
    padding: 8px;
  }
  .carousel-button:hover {
    background: white;
  }
  .carousel-button:first-of-type {
    left: 8px;
  }
  .carousel-button:last-of-type {
    right: 8px;
  } */
  .info {
    padding: 16px;
    background-color: #f9f9f9;
  }
  h3 {
    margin: 0 0 8px 0;
  }
  p {
    margin: 4px 0;
  }
  </style>
  