import { defineStore} from 'pinia';

export const useUserStore = defineStore('userStore', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        currentUserRole: localStorage.getItem('userRole') || '',
        currentUserGreetName: localStorage.getItem('userGreetName') || '',
        currentUserData: null,
        error: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        getUserData: (state) => {
            if (!state.currentUserData) return null;
            console.log(state.currentUserData.role);
            console.log(state.currentUserData.firstName);
            return {
                role: state.currentUserData.role,
                email: state.currentUserData.email,
                fn: state.currentUserData.firstName,
                ln: state.currentUserData.lastName,
                pn: state.currentUserData.preferredName,
                telnr: state.currentUserData.phonenumber,
                street: state.currentUserData.address?.split('|')[0]?.trim(),
                streetnr: state.currentUserData.address?.split('|')[1]?.trim(),
                postcode: state.currentUserData.address?.split('|')[2]?.trim(),
                town: state.currentUserData.address?.split('|')[3]?.trim(),
                country: state.currentUserData.country,
                emergencyTelnr: state.currentUserData.emergencyTel,
            };
        },
    },
    actions: {
        async login(credentials) {
            try {
                const response = await fetch('http://localhost:3100/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(credentials),
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error);
                }
                const result = await response.json();
                this.token = result.token;
                this.currentUserRole = result.userRole;
                this.currentUserGreetName = result.userGreetName;

                // Store in localStorage
                localStorage.setItem('token', result.token);
                localStorage.setItem('userRole', result.userRole);
                localStorage.setItem('userGreetName', result.userGreetName);

                return true;

            } catch (error) {
                this.error = error.message;
                return false;
            }
        },
        async logout() {
            this.token = '';
            this.currentUserRole = '';
            this.currentUserGreetName = '';
            this.currentOtherData = null;

            localStorage.clear();
        },

        async fetchUserData(){
            if (!this.token) return;

            try {
                const response = await fetch(`http://localhost:3100/api/users/`, {
                    headers: {
                        'authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch user data');
                
                this.currentUserData = await response.json();
            } catch (error) {
                this.error = error.message;
            }
        },
        async updateUserData(userData) {
            if (!this.token) return;

            try {
                const response = await fetch(`http://localhost:3100/api/users/`, {
                    method: 'PUT',
                    headers: {
                        'authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: userData.fn,
                        lastName: userData.ln,
                        preferredName: userData.pn,
                        roleUser: userData.role,
                        email: userData.email,
                        phoneNumber: userData.telnr,
                        address: `${userData.street} | ${userData.streetnr} | ${userData.postcode} | ${userData.town}`,
                        country: userData.country,
                        emergencyTel: userData.emergencyTelnr,
                    }),
                });

                if (!response.ok) throw new Error('Failed to update user data');
                
                // Refresh user data after successful update
                await this.fetchUserData();
                return true;
            } catch (error) {
                this.error = error.message;
                return false;
            }
        },
    },
});