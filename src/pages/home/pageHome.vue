<template>
    <div class="content"> 
    <div class="greeting">
        Welkom {{ currentUserGreetName }}!
    </div> 
    <div v-if="isLoading">Loading...</div>
    <campingCardList v-else :campings="campingCardData" />



    </div>
</template>
<script>
import { useUserStore } from '@/stores/userStore';
import { useCampingStore } from '@/stores/campingStore';
import campingCardList from '@/components/campingCardList.vue';
export default{
    name: 'HomePage',
    created() {
        this.initiliazeCampingData();
    },
    components: {
        campingCardList,
    },
    methods: {
        async initiliazeCampingData() {
            const cStore = useCampingStore();
            await cStore.fetchCampings();
            // console.log("homepage data: ");
            // console.log(cStore.campingCards);
        },
    },

    computed: {
        currentUserGreetName() {
            const uStore = useUserStore();
            return uStore.currentUserGreetName;
        },
        
        campingCardData() {
        const cStore = useCampingStore();
        const cardData = cStore.campingCards;
        return cardData; 
        },

        isLoading(){
            const cStore = useCampingStore();
            return cStore.campingCards.length === 0;
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
