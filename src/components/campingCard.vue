<template>
  <router-link class="card" :to="{name: 'CampingDetails', params: {ID: camping.ID }}">

    <div :class="camping.ownerID == userStore.iD ? 'owner-card' : 'camping-card'">
      <!-- {{HIER ONDERSCHEID MAKEN -> EIGENAAR CAMPING = BLAUWE RAND plus aantal andere knoppen}} -->
      <div class="image-camping">
        <img :src="camping.image || require('@/assets/irlFotoTest.jpg')" alt="Camping Image" />
        
        <div v-if="!!camping.startDate && !!camping.endDate" 
        :class=" formatDate(camping.endDate) > new Date() ? 'campingDatesPresent' : 'campingDatesPast'">{{ camping.startDate }} - {{ camping.endDate }}</div>
      </div>
      <div class="info">
        <div class="infoBox">
          <h3 class="leftItem">{{ camping.name }}</h3>
          <h3 class="rightItem">{{ camping.town }}</h3>
        </div>
        <div class = "infoBox">
          <div>
            <p>{{ camping.size }} m²</p>
            <p>€ {{ camping.price }}/nacht</p>
          </div>
          <img v-if="camping.type == 'Tent'" src="@/assets/icons/Tent.png" class="propImg1" />
          <img v-else-if="camping.type == 'Caravan'" src="@/assets/icons/Camper.png" class="propImg2" />
        </div>
      </div>
    </div>
  </router-link>
  </template>
  
  <script>
  import { useUserStore } from '@/stores/userStore';
  import { mapStores } from 'pinia';
  import { formatDate } from '@/shared/formatters'; 
  export default {
    name: 'CampingCard',
    props: {
        camping: {
        type: Object,
        required: true,
      },
    },
  
    computed: {
      ...mapStores(useUserStore),
    },
    methods: {
      formatDate,
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
  .camping-card#owner-card {
    border: 2px solid #04ddfa;
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
  .infoBox{
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

  .propImg1 {
    height: 45px;
    width: auto;
    padding: 10px;
  }
  .propImg2 {
    height: 35px;
    width: auto;
    padding: 10px;
  }
  .campingDatesPresent {
    position: absolute; 
    top: 10px;           
    right: 10px;        
    background-color: rgb(0, 133, 7); 
    color: white;        
    padding: 6px;        
    border-radius: 10px;
  }
  .campingDatesPast {
    position: absolute; 
    top: 10px;           
    right: 10px;        
    background-color: rgb(85, 85, 85); 
    color: white;        
    padding: 6px;        
    border-radius: 10px;
  }


  </style>
  