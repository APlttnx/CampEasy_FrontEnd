import { defineStore} from 'pinia';

export const useFacilityStore = defineStore('facilityStore', {
    state: () => ({
        facilities: [],
    }),
    actions: {
        async fetchFacilities(){
            try {
                const response = await fetch(`http://localhost:3100/api/facilities/`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch facilities');
                
                this.facilities = await response.json();
            } catch (error) {
                this.error = error.message;
                this.facilities = [];
            }
        },
    },
});