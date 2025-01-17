<template>
  <div :class="isTheOwner ? 'campingSplitOwner' : 'campingSplitUser'" v-if="!isLoading">
    <div class="leftColumn">
      <div class="imageCamping">
        <img :src="campingDetails.imageUrl || require('@/assets/defaultCamp.webp')" alt="Camping Image" />
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
        <h4 class="hoofdingBoeking">
          <span v-if="isTheOwner">RESERVEER JE CAMPING</span>
          <span v-else>BOEK HIER:</span>
        </h4>
        <div class="booking">
          <div class="datePickerBox">
            <div class="datePickerItem">
              <label>Van:</label>
              <datepicker v-model="pickedStartDate" class="datePicker" :lower-limit="new Date()"
                :disabled-dates="{dates: unavailableDates}"
                inputFormat="dd-MM-yyyy"/>
            </div>
            <div class="datePickerItem">
              <label>Tot:</label>
              <datepicker v-model="pickedEndDate" class="datePicker" :lower-limit="minDate || new Date()"
                :disabled-dates="{dates: unavailableDates}"
                inputFormat="dd-MM-yyyy"/>
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
        <p class="errorMessage" v-show="accepted && !this.userStore.token">Log eerst in voordat u boekt!</p>
        <p class="errorMessage" v-show="accepted && !isValidDate">Datums ongeldig: zorg ervoor dat de einddatum achter de startdatum ligt!</p>
        <p class="errorMessage" v-show="accepted && !isNoOverbooking">Iemand anders heeft deze periode al geboekt!</p>
        <button @click="this.createBooking()" :disabled="!isGoodToGo" :class="{ 'btn-disabled': !isGoodToGo }">
          <span v-if="isTheOwner">RESERVEREN</span>
          <span v-else>BOEKEN</span>
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
import Datepicker from 'vue3-datepicker'; //bron: https://icehaunter.github.io/vue3-datepicker/

export default {
  data() {
    const pickedStartDate = new Date();
    pickedStartDate.setHours(0,0,0,0);
    let pickedEndDate = new Date();
    pickedEndDate = addDay(pickedStartDate);
    return {
      pickedStartDate,
      pickedEndDate,
      unavailableDates: [],
      accepted: false,
      isTheOwner: false,
    };
  },
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
      const result = !this.isTheOwner ? Math.max(this.amountOfNights * this.campingDetails.price, 0) : 0;
      return result;
    },
    isValidDate() {
      return this.pickedEndDate > this.pickedStartDate;
    },
    isNoOverbooking(){
      let iDate = new Date(this.pickedStartDate);
      while (iDate <= this.pickedEndDate) {
        const isUnavailable = this.unavailableDates.some(date => date.getTime() === iDate.getTime());
        if (isUnavailable) {
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
      await this.fetchBookings();
      await this.checkOwner();
    },
    async checkCampingDataPresent() {
      if (!this.campingStore.campingData || this.campingStore.campingData.length === 0) {
        console.log("Campings unloaded: ");
        await this.campingStore.fetchCampings();
      }
    },
    async checkOwner() {
      if ((!this.campingStore.ownCampingData || this.campingStore.ownCampingData.length === 0) && this.userStore.currentUserRole == 'owner') {
        await this.campingStore.fetchOwnerCampings();
      }
    this.isTheOwner = this.campingStore.isTheOwner(this.campingDetails.ID);
    },
    
    async fetchBookings() {
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
          // iDate = addDay(iDate);

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

      const adjustedStartDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString();
      const adjustedEndDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString();

      const dataToSend = {
        startDate: adjustedStartDate,
        endDate: adjustedEndDate,
        campingId: this.campingDetails.ID,
        totalPrice: this.totalPrice,
      };

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
          console.log("Boeking aangemaakt");
          this.fetchBookings();
          this.$router.push("/overzichtBoekingen");
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
.campingSplitUser {
  display: flex;
  width: 100%;
  justify-content: space-between;
  column-gap: 20px;
}
.campingSplitOwner {
  display: flex;
  width: 100%;
  justify-content: space-between;
  column-gap: 20px;
  border: 3px dotted blue;
  padding: 5px;
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
  height: 550px;
  overflow: hidden;
  border: 1px solid #123524;
  text-align: center;
  background-color: rgba(28, 75, 6, 0.493)
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
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


</style>