import { defineStore} from 'pinia';

export const useUserStore = defineStore('userStore', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        currentUserID: localStorage.getItem('userID') || '',
        currentUserRole: localStorage.getItem('userRole') || '',
        currentUserFirstName: localStorage.getItem('firstName') || '',
        currentUserPrefName: localStorage.getItem('prefName') || '',
        currentUserMail: localStorage.getItem('userMail') || '',
        currentUserData: null,
        error: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
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
                this.currentUserID = result.userID;
                this.currentUserRole = result.userRole;
                this.currentUserFirstName = result.firstName;
                this.currentUserPrefName = result.prefName;
                this.currentUserMail = result.userMail;

                // Store in localStorage
                localStorage.setItem('token', result.token);
                localStorage.setItem('userID', result.userID);
                localStorage.setItem('userRole', result.userRole);
                localStorage.setItem('firstName', result.firstName);
                localStorage.setItem('prefName', result.prefName);
                localStorage.setItem('userMail', result.userMail);

                return true;

            } catch (error) {
                this.error = error.message;
                return false;
            }
        },
        async logout() {
            this.token = '';
            this.currentUserID = '';
            this.currentUserRole = '';
            this.currentUserFirstName = '';
            this.currentUserPrefName = '';
            this.currentUserMail = '';
            this.currentOtherData = null;

            localStorage.clear();
        },

        async fetchUserData(){
            if (!this.token) return;

            try {
                const response = await fetch(`http://localhost:3100/api/users/${this.currentUserID}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) throw new Error('Failed to fetch user data');
                
                this.currentUserData = await response.json();
            } catch (error) {
                this.error = error.message;
            }
        },
    },
});

