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

