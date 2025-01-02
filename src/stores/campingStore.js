import { defineStore } from 'pinia';

export const useCampingStore = defineStore('camping', {
    state: () => ({
        campingData: [],
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
                image: camping.image ? camping.image : require('@/assets/defaultCamp.webp'),
            }));
        },
        getCampingById: (state) => (id) => {
            const campingDetails = state.campingData.find(campingData => campingData.ID == id);
            const addressParts = campingDetails.address.split(' | ');
            const fullAddress = addressParts.length === 4 
                ? `${addressParts[0]} ${addressParts[1]}, ${addressParts[2]} ${addressParts[3]}`
                : campingDetails.address;
            return {...campingDetails, address: fullAddress};
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
                console.log("pinia data");
                console.log(this.campingData);
            } catch (error) {
                this.error = error.message;
                this.campingData = [];
            }
        },
    },
});