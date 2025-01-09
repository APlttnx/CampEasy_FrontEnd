<template>
    <div class="content"> 
        <div class="greeting">
            Welkom {{ currentUserGreetName }}!
        </div> 
        <div v-if="isLoading">Loading...</div>
        <div v-else>
            <campingFilter />
            <campingCardList  :campings="campingCardData" />
        </div>


    </div>
</template>
<script>
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { useCampingStore } from '@/stores/campingStore';
import campingCardList from '@/components/campingCardList.vue';
import campingFilter from '@/components/campingFilter.vue';
export default{
    name: 'HomePage',
    created() {
        this.initiliazeCampingData();
    },
    components: {
        campingCardList,
        campingFilter,
    },
    methods: {
        async initiliazeCampingData() {
            if (this.campingStore.campingData.length==0){
                await this.campingStore.fetchCampings();
            }
        },
    },

    computed: {
        ...mapStores(useUserStore, useCampingStore),
        currentUserGreetName() {
            return this.userStore.currentUserGreetName;
        },
        campingCardData() {
            const cardData = this.campingStore.filteredCampingCards;
            return cardData; 
        },
        isLoading(){
            return this.campingStore.campingCards.length === 0;
        },
    },
};
</script>
<style>
.greeting{
    margin: auto;
    text-align: center;
    font-size: 25px; 
}
.campingCards{
    display: flex;
    width: 100%;
    margin: 10px;
    padding: 20px;
    flex-wrap: wrap;
}
</style>
