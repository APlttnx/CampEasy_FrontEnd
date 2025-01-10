<template>
    <div>
        <div class='filter'>
            <div class="filterItem">
                <label for="filterQuery">Zoeken op naam</label>
                <input id="filterQuery" type="text" v-model="campingStore.filter.searchQuery"/>
            </div>
            <div class="filterItem small">
                <label for="filterType">Type</label>
                <select id="filterType" v-model="campingStore.filter.type">
                    <option>Tent</option>
                    <option>Caravan</option>
                    <option value="">Alles</option>
                </select>
            </div>
            <div class="filterItem small">
                <label for="filterSize">Min. m²</label>
                <input id="filterSize" type="number" min="0" v-model="campingStore.filter.size">
            </div>
            <div class="filterItem small">
                <label for="filterMinPrice">Min. Prijs</label>
                <input id="filterMinPrice" type="number" min="0" v-model="campingStore.filter.priceMin">
            </div>
            <div class="filterItem small">
                <label for="filterMaxPrice">Max. Prijs</label>
                <input id="filterMaxPrice" type="number" min="0" v-model="campingStore.filter.priceMax">
            </div>
            <div class="filterItem">
                <label for="filterTown">Gemeente</label>
                <select id="filterTown" v-model="campingStore.filter.town">
                    <option value="">Alles</option>
                    <option v-for="town in campingStore.filterTownOptions" :key="town">{{ town }}</option>
                </select>
                
            </div>
            <div class="filterItem">
                <label for="filterCountry">Land</label>
                <select id="filterCountry" v-model="campingStore.filter.country">
                    <option value="">Alles</option>
                    <option v-for="country in campingStore.filterCountryOptions" :key="country">{{ country }}</option>
                </select>
            </div>
            <br>
            <div v-show="isExtended">
                <label>Faciliteiten</label>
                <div class="facilities">
                    <div v-for="facility in facilityStore.facilities" :key="facility.id">
                        <div>
                            <input type="checkbox" :value="facility.facilityName" v-model="campingStore.filter.facilities" />
                            {{ facility.facilityName }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="filterButtons">
                <button @click="campingStore.resetFilter()">Reset</button>
            </div>
            <button :class="isExtended ? 'ext extendButton' : 'ext noExtendButton'" @click="toggleExtended()"></button>
        </div>
        
    </div>
</template>

<script>
import { useCampingStore } from '@/stores/campingStore';
import { useFacilityStore } from '@/stores/facilityStore';
import { mapStores } from 'pinia';
export default {
    name: 'CampingFilter',
    created() {
        this.facilityStore.facilities.Length === 0 || this.fetchFacilities();
    },
    data() {
    return{
        isExtended: false,
    };
        
    },
    props: {

    },

    computed: {
        ...mapStores(useCampingStore, useFacilityStore),
    },
    methods: {
        async fetchFacilities() {
            await this.facilityStore.fetchFacilities();
        },
        toggleExtended() {
            this.isExtended = this.isExtended ? false : true;
        },

    },


};

</script>

<style scoped>
.filter {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    min-height: 80px;
    background-color: #ffffff8e;
    border-radius: 10px;
    margin: 15px;
    margin-top: 20px;
    width: 96%;
    min-width: 500px;
    border: 1px solid #203801;
    padding: 10px;
    column-gap: 5px;
}

.filterItem {
    width: 200px;
}

.filterItem.small {
    width: 100px;
}

.filterItem label {
    margin-top: 3px;
}

.filterItem input[type="text"],
.filterItem input[type="number"],
.filterItem select {
    padding: 5px;
    margin: 8px 0px 10px 0px;
    width: 100%;
}
.facilities{
    display: flex;
    flex-wrap: wrap;
    margin: 5px;
}
.filterButtons {
    display: flex;
    width: 15%;
    column-gap: 5px;
    position: absolute;
    right: 20px;
    bottom: -25px;
}

.filterButtons button {
    border: 1px solid #203801;
    background-color: #81af46;
}
.ext{
    color: black;
    background:#898d831e;
    height: 25px;
    padding:0px;
    width: 100%;
}
.ext.extendButton::before{
    content: '\25B2';
}
.ext.noExtendButton::before{
    content: '\25BC';
}
</style>
