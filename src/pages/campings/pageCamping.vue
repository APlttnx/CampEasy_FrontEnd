<template>
  <div class="campingSplit" v-if="!isLoading">
    <div class="leftColumn">
      <div class="imageCamping">
        <img src="@/assets/irlFotoTest.jpg" />
      </div>
      <div class="addressBox">
        <p class="address">{{ campingDetails.address }}</p>
        <p class="address">{{ campingDetails.country }} </p>
      </div>

      <div class="faciliteiten" v-show="campingDetails.facilities[0] != null">
        <div v-for="(facility, index) in campingDetails.facilities" :key="index" class="faciliteitItem">
          {{ facility }}
        </div>
      </div>
      <div class="props">
        <div class="propitem">
          <img v-if="campingDetails.type == 'Tent'" src="@/assets/icons/Tent.png" class="propImg" />
          <img v-else-if="campingDetails.type == 'Caravan'" src="@/assets/icons/Camper.png" class="propImg" />
          <p>{{ campingDetails.type }}</p>
        </div>
        <div class="propitem">
          <p>{{ campingDetails.size }} m²</p>
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
        <p>Aangeboden door: {{ campingDetails.firstName }} {{ campingDetails.lastName }}</p>
        <p>Laatste update: {{ campingDetails.updateDate }}</p>
      </div>

    </div>

    <div class="rightColumn">
      <div class="costAndBooking">
        <h4 class="hoofdingBoeking">BOEK HIER:</h4>

        <div class="booking">
          <div class="datePickerBox">
            <div class="datePickerItem">
              <label>Van:</label>
              <datepicker v-model="pickedStartDate" class="datePicker" :lower-limit="new Date()"
                :disabled-dates="{dates: unavailableDates}"/>
            </div>
            <div class="datePickerItem">
              <label>Tot:</label>
              <datepicker v-model="pickedEndDate" class="datePicker" :lower-limit="minDate || new Date()"
                :disabled-dates="{dates: unavailableDates}"/>
            </div>
          </div>
          <div class="bookingCalculation">
            <p>Aantal nachten: {{ amountOfNights }}</p>
            <p>Prijs per nacht: {{ toCurrency(campingDetails.price) }}</p>
            <p class="totalPrice">Totale prijs: {{ toCurrency(totalPrice) }}</p>
          </div>
        </div>
        <p>
          <input type="checkbox" v-model="accepted" />
          Ik ga akkoord met de <a href="/serviceAgreement.txt" target="_blank">servicevoorwaarden</a>
        </p>
        <p class="bookWarning" v-show="accepted && !this.userStore.token">Log eerst in voordat u boekt!</p>
        <p class="bookWarning" v-show="accepted && !isValidDate">Datums ongeldig: zorg ervoor dat de einddatum achter de startdatum ligt!</p>
        <p class="bookWarning" v-show="accepted && !isNoOverbooking">Iemand anders heeft deze periode al geboekt!</p>
        <button @click="this.createBooking()" :disabled="!isGoodToGo" :class="{ 'btn-disabled': !isGoodToGo }">
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
import { addDay } from '@/shared/formatters';
import Datepicker from 'vue3-datepicker';

export default {
  data() {
    const pickedStartDate = new Date();
    pickedStartDate.setHours(0,0,0,0);
    let pickedEndDate = new Date();
    pickedEndDate = addDay(pickedStartDate);
    console.log('einddatum');
    console.log(pickedEndDate);
    return {
      pickedStartDate,
      pickedEndDate,
      unavailableDates: [],
      accepted: false,
    };
  },
  // mounted() {
  //   this.checkCampingDataPresent();
  // },
  created() {
    this.initializeData();
  },
  components: {
    Datepicker,
  },
  computed: {

    ...mapStores(useCampingStore, useUserStore),
    minDate() {
    return (addDay(this.pickedStartDate));
    },
    campingDetails() {
      return this.campingStore.getCampingById(this.$route.params.ID);
    },
    amountOfNights() {
      return Math.max((this.pickedEndDate - this.pickedStartDate) / (24 * 60 * 60 * 1000),0);
    },
    totalPrice() {
      return Math.max(this.amountOfNights * this.campingDetails.price, 0);
    },
    isValidDate() {
      return this.pickedEndDate > this.pickedStartDate;
    },
    isNoOverbooking(){
      let iDate = new Date(this.pickedStartDate);
      while (iDate <= this.pickedEndDate) {
        const isUnavailable = this.unavailableDates.some(date => date.getTime() === iDate.getTime());
        if (isUnavailable) {
          console.log("niet geldig");
          return false;
        }     
        iDate = addDay(iDate);
      }
      return true;
    },
    isGoodToGo() {
      return (this.isValidDate && this.accepted && !!this.userStore.token && this.isNoOverbooking);
    },
    isLoading(){
      return this.campingStore.campingCards.length === 0;
    },
  },

  methods: {
    async initializeData() {
      await this.checkCampingDataPresent();
      this.fetchBookings();
    },
    async checkCampingDataPresent() {
      if (!this.campingStore.campingData || this.campingStore.campingData.length === 0) {
        console.log("Campings unloaded: ");
        await this.campingStore.fetchCampings();
      }
    },
    async fetchBookings() {
      console.log('test');
      try {
        console.log(`fetching bookings for camping: ${this.campingDetails.ID} `);
        const response = await fetch(`http://localhost:3100/api/bookedDates?campingID=${this.campingDetails.ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          
        });
        if (!response.ok) throw new Error('Failed to fetch campings');
        const bookedDateRanges = await response.json();
        
        bookedDateRanges.forEach(({startDate, endDate}) => {
          let iDate = new Date(startDate);
          iDate = addDay(iDate);
          const limitDate = new Date(endDate);
          while (iDate <= limitDate) {
            this.unavailableDates.push(iDate);
            iDate = addDay(iDate);
          }
        });

      } catch (error) {
        console.log(error.message);
      }
    },
    createBooking() {
      if (!this.userStore.token) {
        console.log("no user logged in");
        this.$router.push('/login');
        return false;
      }
      //voor de zekerheid nakijken dat tijd op 0 staat
      const startDate = this.pickedStartDate;
      startDate.setHours(0,0,0,0);
      const endDate = this.pickedEndDate;
      endDate.setHours(0,0,0,0);

      const dataToSend = {
        startDate: startDate,
        endDate: endDate,
        campingId: this.campingDetails.ID,
        totalPrice: this.totalPrice,
      };
      //console.log(dataToSend);

      fetch("http://localhost:3100/api/bookings", {
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
          alert("Boeking aangemaakt");
          this.fetchBookings();
          return response.json();
        })
        .catch(error => {
          console.error('Error:', error);
        });
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
  border: 1px solid #123524;
  text-align: center;
  background-color: rgba(28, 75, 6, 0.493)
}

img {
  width: 100%;
  max-width: 700px;
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

.faciliteitItem {
  border: 1px solid #123524;
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

.props {
  display: flex;
  justify-content: space-between;
  width: 75%;
  margin: auto;
  margin-top: 15px;
  height: 50px;
  border: 1px solid #203801;
}

.propitem {
  padding: 10px;
  border-right: 1px solid #203801;
  display: flex;
  width: 50%;
  justify-content: center;
  column-gap: 10px;
}

.propitem:last-child {
  border-right: none;
}

img.propImg {
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

p.address {
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
  margin-top: 15px;
  margin-bottom: 10px;
  margin-right: 20px;

}

.owner {
  color: gray;
  margin: 10px;
}

.owner p {
  margin: 5px
}

.addressBox {
  display: flex;
  justify-content: space-between;
}

.costAndBooking {
  height: auto;
  border: 1px solid #203801;
  padding: 10px;
}

.datePickerBox {
  display: flex;
  justify-content: center;
}

.datePickerItem {
  width: 50%;
}

.datePicker {
  text-align: center;
}

.bookingCalculation {
  text-align: right;
  margin-right: 15px;
  margin-top: 25px;
  margin-bottom: 25px;
  border-top: 1px solid #203801;
  border-bottom: 1px solid #203801;
}

.totalPrice {
  border-top: 1px dotted #203801;
  font-weight: bold;
  padding-top: 10px;
}

.hoofdingBoeking {
  margin-left: 0px;
  margin-top: 10px;
  margin-bottom: 10px;
}

p.bookWarning{
  color: red;
  font-size: 12px;
}
</style>