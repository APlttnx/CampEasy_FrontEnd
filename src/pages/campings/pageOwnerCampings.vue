<template>
    <div class="content"> 
        <div class="flex">
            <!-- voor verdeling titel -> even groot vak links zetten als rechts -->
            <div class="totalEarnings"></div> 
            <div class="greeting">
                Jouw campings:
            </div> 
            <div class="totalEarnings">
                Som inkomsten: {{ toCurrency(campingStore.ownerTotalEarnings) }}
            </div>
        </div>
        <div v-if="isLoading">Loading...</div>
        <div v-else>
            <campingCardList :campings="ownerCampingCardData" />
        </div>
    </div>
</template>
<script>
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { useCampingStore } from '@/stores/campingStore';
import campingCardList from '@/components/campingCardList.vue';
import { toCurrency } from '@/shared/formatters';
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

        ownerCampingCardData() {
            if (this.isLoading){
                return [];
            }
            const cardData = this.campingStore.ownerCampingCards;
            return cardData; 
        },

        isLoading(){
            return this.campingStore.campingCards.length === 0 || this.campingStore.ownCampingData.length === 0;
        },
    },
    methods: {
        async fetchCampings(){
           await this.campingStore.fetchCampings();
        },
        async fetchYourCampings(){
            await this.campingStore.fetchOwnerCampings();
        },
        toCurrency,
    },
    
    
};
</script>

<style scoped>
.flex{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.totalEarnings{
    font-size: 20px;
    position: relative;
    width:15%;
    min-width: 143px;
}

</style>
