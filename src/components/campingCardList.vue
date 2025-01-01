<template>
    <div class="campingCardsList">
      <campingCard v-for="camping in campings" :key="camping.ID" :camping="camping" />
    </div>
  </template>

<script>
import campingCard from '@/components/campingCard.vue';

export default {
    name: 'CampingCardList',
    components: {
        campingCard,
    },
    props: {
        campings: {
            type: Array,
            required: true,
        },
    },

};
</script>

<style scoped>
.campingCardsList {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center; 
}    
</style>
