import { defineStore } from 'pinia';
import { useUserStore } from './userStore';
import { formatDate } from '@/shared/formatters';

export const useCampingStore = defineStore('camping', {

    state: () => ({
        campingData: [],
        ownCampingData: [],
        bookings: [],
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
                ownerID: camping.ownerID,
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
                    ownerID: camping.ownerID,
                    image: camping.image ? camping.image : require('@/assets/irlFotoTest.jpg'),
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                };
                formatDate(card.endDate) >= new Date() ? presentBookings.push(card) : pastBookings.push(card);
            }); 
            console.log('ARRAY CHECKS');
            console.log(presentBookings);
            console.log(pastBookings);
            return {presentBookings, pastBookings};
        },


        // bookedCampingCards: (state) => {
        //     return state.bookings.map(booking =>{
        //         const camping = state.campingData.find(camping=>camping.ID === booking.campingID);
        //         return {
        //             ID: camping.ID,
        //             name: camping.name,
        //             type: camping.type,
        //             size: camping.size,
        //             price: camping.price,
        //             town: camping.address.split('|')[3]?.trim(),
        //             ownerID: camping.ownerID,
        //             image: camping.image ? camping.image : require('@/assets/defaultCamp.webp'),
        //             startDate: booking.startDate,
        //             endDate: booking.endDate,
        //         };
        //     });
        // },
        
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
                this.error = error.message;
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
        
    },
});