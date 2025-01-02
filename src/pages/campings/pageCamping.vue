<template>
  <div class="campingSplit">
    <div class="leftColumn">
      <div class="imageCamping">
        <img src="@/assets/defaultCamp.webp" />
      </div>
      <div class="addressBox">
        <p class="address">{{campingDetails.address}}</p>
        <p class="address">{{campingDetails.country}} </p>
      </div>

      <div class="faciliteiten" v-show="campingDetails.facilities[0]!=null">
        <div v-for="(facility,index) in campingDetails.facilities" :key="index" class="faciliteitItem">
            {{facility}}
        </div>
      </div>
      <div class="props">
        <div class="propitem">
          <img v-if="campingDetails.type =='Tent'" src="@/assets/icons/Tent.png" class="propImg"/>
          <img v-else-if="campingDetails.type =='Caravan'" src="@/assets/icons/Camper.png" class="propImg"/>
          <p>{{campingDetails.type}}</p>
        </div>
        <div class="propitem">
          <p>{{campingDetails.size}} m²</p>
        </div>
      </div>
      <div>
        <h4>Omschrijving:</h4>
        <div class="textbox">
          <p>
            {{ campingDetails.description }}
          </p>
        </div>
      </div>
      <div class="owner">
        <p>Aangeboden door: {{campingDetails.firstName}} {{campingDetails.lastName}}</p>
        <p>Laatste update: {{campingDetails.updateDate}}</p>
      </div>

    </div>

    <div class="rightColumn">
      <div class="costAndBooking">
        <p> {{toCurrency(campingDetails.price) }} per nacht</p>
      </div>
    </div>
  </div>
</template>


<script>
import { mapStores } from 'pinia';
import { useCampingStore } from '@/stores/campingStore';
import { toCurrency } from '@/shared/formatters';

export default{
  // data() {
  //   return{
  //     camping: [],
  //   };
  // },
  mounted() {
    this.checkCampingDataPresent();
  },
  computed: {
    ...mapStores(useCampingStore),
    
    campingDetails() {
      console.log(this.$route.params.ID);
      return this.campingStore.getCampingById(this.$route.params.ID);
    },
  },

  methods: {
    async checkCampingDataPresent(){
      if (!this.campingStore.campingData || this.campingStore.campingData.length === 0){
        await this.campingStore.fetchCampings();
      }
    },
    toCurrency,
  },
};


</script>


<style scoped>
.campingSplit {
  display: flex;
  width: 100%;
  justify-content: space-between;
  column-gap: 20px;

}

.leftColumn {
  width: 66.66%;
  border: 1px solid #ef8d05;
}

.rightColumn {
  width: 33.34%;
  border: 1px solid #f70101;
}

.imageCamping {
  position: relative;
  height: 400px;
  overflow: hidden;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.faciliteiten {

  margin-top: 5px;
  min-height: 40px;
  padding: 8px;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
}
.faciliteitItem{
  border: 1px solid #213f05;
  background-color: #7dc74044;
  margin: 2px;
  padding: 2px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 15px;
  align-content: center;

}

.textbox {
  border: 1px solid #203801;
  background-color: #ffffff8e;
  margin-top: 5px;
  min-height: 80px;
  border-radius: 10px;
  padding-left: 8px;
  
}

.props{
  display: flex;
  justify-content: space-between;
  width: 75%;
  margin: auto;
  margin-top: 15px;
  height: 50px;
  border: 1px solid #203801;
}

.propitem{
  padding: 10px;
  border-right: 1px solid #203801;
  display:flex;
  width: 50%;
  justify-content: center;
  column-gap: 10px;
}

.propitem:last-child {
  border-right: none;
}

img.propImg{
  width: 40px;
  object-fit: contain;
  display: block;
}

h4 {
  margin-bottom: 5px;
  margin-top: 15px;
  margin-left: 5px;
  font-size: 16px;
}

p {
  margin-top: 8px;
}
p.address{
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
  margin-top: 15px;
  margin-bottom: 10px;
  margin-right: 20px;

}
.owner{
color: gray;
margin: 10px;
}
.owner p{
margin:5px
}

.costAndBooking{
  height:380px;
  border: 1px solid #203801;
  padding: 10px;
}

.addressBox{
  display: flex;
  justify-content: space-between
}
</style>