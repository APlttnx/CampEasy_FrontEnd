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
        <h4 class="hoofdingBoeking">BOEK HIER:</h4>
        
        <div class="booking">
          <div class="datePickerBox">
              <div class="datePickerItem">
                <label>Van:</label>
                <datepicker 
                  v-model="pickedStartDate"
                  class= "datePicker"
                  :lower-limit="new Date()"
                />
              </div>
              <div class="datePickerItem">
                <label>Tot:</label>
                <datepicker 
                  v-model="pickedEndDate" 
                  class="datePicker"
                  :lower-limit="pickedStartDate||new Date()"
                />
              </div>
          </div>
          <div class="bookingCalculation">
            <p>Aantal nachten: {{ amountOfNights }}</p>
            <p>Prijs per nacht: {{toCurrency(campingDetails.price) }}</p>
            <p class="totalPrice">Totale prijs: {{ toCurrency(totalPrice) }}</p>
          </div>
        </div>
        <p>
          <input type="checkbox" v-model="accepted" />
          Ik ga akkoord met de servicevoorwaarden
        </p>
        <button 
          :disabled="!isGoodToGo"
          :class="{'btn-disabled': !isGoodToGo}">
          BOEKEN 
        </button>
      </div>
    </div>


  </div>
</template>


<script>
import { mapStores } from 'pinia';
import { useCampingStore } from '@/stores/campingStore';
import { useUserStore } from '@/stores/userStore';
import { toCurrency } from '@/shared/formatters';
import Datepicker from 'vue3-datepicker';

export default{
  data() {
    return{
        pickedStartDate: new Date() ,
        pickedEndDate: new Date() ,
        accepted: false,
    };
  },
  mounted() {
    this.checkCampingDataPresent();
  },
  created() {
    this.checkCampingDataPresent();
  },
  components: {
    Datepicker,
  },
  computed: {
    ...mapStores(useCampingStore, useUserStore),
    
    campingDetails() {
      console.log(this.$route.params.ID);
      return this.campingStore.getCampingById(this.$route.params.ID);
    },

    amountOfNights() {
      return Math.round((this.pickedEndDate - this.pickedStartDate)/(24*60*60*1000)+1);
    },
    totalPrice() {
      return Math.max(this.amountOfNights * this.campingDetails.price, 0);
    },
    isValidDate() {
      return this.amountOfNights > 0;
    },
    isGoodToGo(){
      return (this.isValidDate && this.accepted && !!this.userStore.token);
    },
  },

  methods: {
    async checkCampingDataPresent(){
      if (!this.campingStore.campingData || this.campingStore.campingData.length === 0){
        console.log("Campings unloaded: ");
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
  /* border: 1px solid #ef8d05; */
}

.rightColumn {
  width: 33.34%;
  /* border: 1px solid #f70101; */
}

.imageCamping {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  border: 1px solid #213f05;
  text-align: center;
  background-color: rgba(28, 75, 6, 0.493)
}

img {
  width: 100%;
  max-width: 700px;
  height: 100%;
  object-fit:cover;
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

.addressBox{
  display: flex;
  justify-content: space-between;
}

.costAndBooking{
  height:auto;
  border: 1px solid #203801;
  padding: 10px;
}

.datePickerBox{
  display: flex;
  justify-content: center;
}
.datePickerItem{
  width: 50%;
}

.datePicker{
  text-align: center;
}

.bookingCalculation{
  text-align: right;
  margin-right: 15px;
  margin-top: 25px;
  margin-bottom: 25px;
  border-top: 1px solid #203801;
  border-bottom: 1px solid #203801;
}
.totalPrice{
  border-top: 1px dotted #203801;
  font-weight: bold;
  padding-top: 10px;
}

.hoofdingBoeking{
  margin-left:0px;
  margin-top:10px;
  margin-bottom:10px;
}
</style>