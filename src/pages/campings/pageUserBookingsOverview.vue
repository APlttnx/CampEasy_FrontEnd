<template>
    <div class="content"> 
        <div class="greeting">
            Jouw boekingen:
        </div> 
        <div v-if="isLoading">Loading...</div>
        <div v-else>
            <campingCardList :campings="campingCardData.presentBookings" />
        <hr>
            <div class="greeting">Afgelopen boekingen:</div>
            <campingCardList  :campings="campingCardData.pastBookings" />
        </div>
    </div>
</template>
<script>
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { useCampingStore } from '@/stores/campingStore';
import campingCardList from '@/components/campingCardList.vue';
export default{
    name: 'userBookingsOverview',
    created() {
        this.campingStore.campingData.length != 0 || this.fetchCampings();
        this.userStore.token ? this.fetchBookingsData() : this.$router.push('/');
    },
    components: {
        campingCardList,
    },
    computed: {
        ...mapStores(useUserStore, useCampingStore),

        campingCardData() {
            if (this.isLoading){
                return [];
            }
            const cardData = this.campingStore.bookedCampingCards;
            console.log("HELLO THERE ____________________________________");
            console.log(cardData);
            console.log(cardData.pastBookings);
            console.log(cardData.presentBookings);
            return cardData; 
        },

        isLoading(){
            return this.campingStore.campingCards.length === 0;
        },
    },
    methods: {
        async fetchCampings(){
           await this.campingStore.fetchCampings();
        },
        async fetchBookingsData(){
            await this.campingStore.fetchBookingsData();
        },
    },
    
    
};
</script>

<style>


</style>
