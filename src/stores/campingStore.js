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
                country: camping.country,
                image: camping.imageUrl || require('@/assets/defaultCamp.webp'),
                facilities: camping.facilities,
            }));
        },

        filteredCampingCards: (state) => {
            return state.campingCards.filter(camping => {
                // type
                if (state.filter.type && camping.type != state.filter.type) return false;

                // groote
                if (state.filter.size && camping.size < state.filter.size) return false;
    
                // Prijs
                if (state.filter.priceMin && camping.price < state.filter.priceMin) return false;
                if (state.filter.priceMax && camping.price > state.filter.priceMax) return false;
    
                //Gemeente;
                if (state.filter.town && state.filter.town != camping.town) return false;
    
                // Land
                if (state.filter.country && state.filter.country != camping.country) return false;
    
                // Faciliteiten
                console.log(state.filter.facilities.length);
                if (state.filter.facilities.length > 0) {
                    const campingFacilities = camping.facilities || [];
                    var result = true;
                    for (const filterFacility of state.filter.facilities){
                        if(!campingFacilities.includes(filterFacility)) result = false;
                    }
                    if (!result) return false;
                }
                
                // Search query (name search)
                if (state.filter.searchQuery) {
                    return camping.name.toLowerCase().includes(state.filter.searchQuery.toLowerCase());
                }
    
                return true;
            });
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
                    image: camping.imageUrl,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    totalPrice: booking.totalPrice,
                };
                
                formatDate(card.endDate) >= new Date() ? presentBookings.push(card) : pastBookings.push(card);
            }); 
            return {presentBookings, pastBookings};
        },

        isTheOwner: (state) => (id) => {
            if (state.ownCampingData.length === 0) {
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
                    image: camping.imageUrl,
                    earnings: ownedCamping.campingEarnings || 0,
                    isOwner: true,
                };
                campingCards.push(card);
            });
            return campingCards;
        },
        filterTownOptions: (state) => {
            const townSet = [...new Set(state.campingData.map(camping => camping.address.split('|')[3].trim()))];
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
        
        logout() {
            this.ownCampingData = [];
            this.ownerTotalEarnings = '';
            this.bookings = [];
        },
        
    },
});