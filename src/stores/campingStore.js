import { defineStore } from 'pinia';
import { useUserStore } from './userStore';
import { formatDate } from '@/shared/formatters';


export const useCampingStore = defineStore('camping', {

    state: () => ({
        campingData: [],
        ownCampingData: [],
        ownerTotalEarnings: '',
        bookings: [],
        filter: {
            type: '',
            size: null,
            priceMin: null,
            priceMax: null,
            town:'',
            country:'',
            facilities:[],
            searchQuery:'',
        },
    }),

    getters: {
        campingCards: (state) => {
            return state.campingData.map(camping => ({
                ID: camping.ID,
                name: camping.name,
                type: camping.type,
                size: camping.size,
                price: camping.price,
                town: camping.address.split('|')[3]?.trim(),
                image: camping.image ? camping.image : require('@/assets/irlFotoTest.jpg'),
            }));
        },
        getCampingById: (state) => (id) => {
            const campingDetails = state.campingData.find(campingData => campingData.ID == id);
            const addressParts = campingDetails.address.split(' | ');
            const fullAddress = `${addressParts[0]} ${addressParts[1]}, ${addressParts[2]} ${addressParts[3]}`;
            return {...campingDetails, address: fullAddress};
        },
        bookedCampingCards: (state) => {
            const presentBookings = [];
            const pastBookings = [];
            state.bookings.forEach(booking =>{
                const camping = state.campingData.find(camping=>camping.ID === booking.campingID);
                const card = {
                    ID: camping.ID,
                    name: camping.name,
                    type: camping.type,
                    size: camping.size,
                    price: camping.price,
                    town: camping.address.split('|')[3]?.trim(),
                    image: camping.image ? camping.image : require('@/assets/irlFotoTest.jpg'),
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                };
                formatDate(card.endDate) >= new Date() ? presentBookings.push(card) : pastBookings.push(card);
            }); 
            return {presentBookings, pastBookings};
        },

        isTheOwner: (state) => (id) => {
            console.log(id);
            console.log(state.ownCampingData.length);
            if (state.ownCampingData.length === 0) {
                console.log('fail');
                return false;
            }
            const result = (state.ownCampingData.some(camping => camping.ID === id));
            return result;
        },
        ownerCampingCards: (state) => {
            const campingCards = [];
            if (state.ownCampingData.length === 0 || state.campingData.length ===0) return campingCards;
            state.ownCampingData.forEach(ownedCamping =>{
                const camping = state.campingData.find(camping=>camping.ID === ownedCamping.ID);
                const card = {
                    ID: camping.ID,
                    name: camping.name,
                    type: camping.type,
                    size: camping.size,
                    price: camping.price,
                    town: camping.address.split('|')[3]?.trim(),
                    image: camping.image ? camping.image : require('@/assets/irlFotoTest.jpg'),
                    earnings: ownedCamping.campingEarnings || 0,
                    isOwner: true,
                };
                campingCards.push(card);
            });
            return campingCards;
        },
        filterTownOptions: (state) => {
            const townSet = [...new Set(state.campingData.map(camping => camping.address.split('|')[3]?.trim()))];
            return townSet;
        },
        filterCountryOptions: (state) => {
            const townSet = [...new Set(state.campingData.map(camping => camping.country))];
            return townSet;
        },
        
    },
    actions: {
        async fetchCampings() {
            try {
                console.log("fetching campings");
                const response = await fetch(`http://localhost:3100/api/campingGeneralData/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                });
                if (!response.ok) throw new Error('Failed to fetch campings');
                this.campingData = await response.json();
            } catch (error) {

                this.campingData = [];
            }
        },
        async fetchBookingsData(){
            try{
                const userStore = useUserStore();
                if (!userStore.token) throw new Error('Gebruiker is niet ingelogd');
                console.log("fetching booking data");
                const response = await fetch(`http://localhost:3100/api/bookingsOverview/`, {
                    method: 'GET',
                    headers: {
                        'authorization': `Bearer ${userStore.token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch campings');
                this.bookings = await response.json();
            } catch (error) {
                this.error = error.message;
                this.bookings = [];
            }
        },
        async fetchOwnerCampings(){
            try{
                const userStore = useUserStore();
                if (!userStore.token) throw new Error('Gebruiker is niet ingelogd');
                console.log("fetching campingdata owner");
                const response = await fetch(`http://localhost:3100/api/ownerCampings/`, {
                    method: 'GET',
                    headers: {
                        'authorization': `Bearer ${userStore.token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch campings');
                const result = await response.json();
                this.ownerTotalEarnings = result.totalEarnings || 0;
                this.ownCampingData = result.campingEarnings;
            } catch (error) {
                this.error = error.message;
                this.ownCampingData = [];
                this.ownerTotalEarnings = '';
            }
        },
        resetFilter(){
            this.filter = {
                type: '',
                size: null,
                priceMin: null,
                priceMax: null,
                town: '',
                country: '',
                facilities: [],
                searchQuery: '',
            };
        },
    },
});