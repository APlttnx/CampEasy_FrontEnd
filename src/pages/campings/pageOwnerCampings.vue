<template>
    <div class="content"> 
        <div class="greeting">
            Jouw campings:
        </div> 
        <div v-if="isLoading">Loading...</div>
        <div v-else>
            <campingCardList :campings="campingCardData" />
        </div>
    </div>
</template>
<script>
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { useCampingStore } from '@/stores/campingStore';
import campingCardList from '@/components/campingCardList.vue';
export default{
    name: 'OwnerCampingPage',
    created() {
        this.campingStore.campingData.length != 0 || this.fetchCampings();
        this.userStore.token && this.userStore.currentUserRole === "owner" ? this.fetchYourCampings() : this.$router.push('/');
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
            const cardData = this.campingStore.ownerCampingCards;
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
        async fetchYourCampings(){
            await this.campingStore.fetchOwnerCampings();
        },
    },
    
    
};
</script>

<style>


</style>
