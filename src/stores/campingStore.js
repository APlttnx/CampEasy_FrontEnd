import { defineStore } from 'pinia';

export const useCampingStore = defineStore('campingStore', {
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
                town: camping.address?.split('|')[3]?.trim(), // Assuming 'address' contains 'town' information
                country: camping.country,
                image: camping.image? camping.image : require('@/assets/defaultCamp.webp'),
            }));
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
                console;
            } catch (error) {
                this.error = error.message;
                this.campingData = [];
            }
        },
    },
});