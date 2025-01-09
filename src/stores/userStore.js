import { defineStore} from 'pinia';

export const useUserStore = defineStore('user', {
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
                this.currentUserRole = this.currentUserData.userRole;
                this.currentUserGreetName = this.currentUserData.preferredName || this.currentUserData.firstName;

                // Store in localStorage
                localStorage.setItem('userRole', this.currentUserRole);
                localStorage.setItem('userGreetName', this.currentUserGreetName);
            }catch (error) {
                this.error = error.message;
            }
        },
        async updateUserData(userData) {
            console.log("updating user:");
            if (!this.token) return;
            try {
                localStorage.setItem('userGreetName', userData.preferredName);
                this.userGreetName = userData.preferredName;
                const response = await fetch(`http://localhost:3100/api/users/`, {
                    method: 'PUT',
                    headers: {
                        'authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        preferredName: userData.preferredName || "",
                        roleUser: userData.roleUser,
                        email: userData.email,
                        phoneNumber: userData.phoneNumber,
                        address: userData.address || "",
                        country: userData.country || "",
                        emergencyTel: userData.emergencyTel || "",
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    this.error = errorData;
                    return Promise.reject(errorData); //!
                }

                // Refresh user data
                await this.fetchUserData();
                // const successData = await response.json();
                // return successData;
            } catch (error) {
                this.error = error.message;
                return Promise.reject(error);
            }
        },
    },
});