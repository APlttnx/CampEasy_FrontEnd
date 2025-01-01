<template>
  <router-link class="card" :to="{name: 'CampingDetails', params: {ID: camping.ID }}">
    <div class="camping-card">
      <div class="image-camping">
        <img :src="camping.image || require('@/assets/headerAfb.jpg')" alt="Camping Image" />
      </div>
      <div class="info">
        <div class="topline">
          <h3 class="leftItem">{{ camping.name }}</h3>
          <h3 class="rightItem">{{ camping.town }}</h3>
        </div>
        <p>{{ camping.size }} m²</p>
        <p>€ {{ camping.price }}/nacht</p>
      </div>
    </div>
  </router-link>
  </template>
  
  <script>
  export default {
    name: 'CampingCard',
    props: {
        camping: {
        type: Object,
        required: true,
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
  .info {
    padding: 16px;
    background-color: #f9f9f9;
    height: 100px;
  }
  h3 {
    margin: 0 0 8px 0;
  }
  p {
    margin: 4px 0;
  }
  .card {
    color: inherit;
    text-decoration: none;
  }
  .topline{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
  }
  h3.leftItem{
    margin: 0;
    text-align: left;
  }
  h3.rightItem{
    margin: 0;
    text-align: right;
  }
  </style>
  