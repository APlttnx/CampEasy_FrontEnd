import {createRouter, createWebHashHistory} from 'vue-router';
import HomePage from '../pages/home/pageHome.vue';
import RegisterPage from '../pages/authentication/pageRegister.vue';
import UserInfoPage from '../pages/userInfo/pageUserInfo.vue';


export default createRouter({
    history: createWebHashHistory(), // gebruik hashtag routing ipv html5 routing
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomePage,
        },
        {
            path: '/registreren',
            name: 'Register',
            component: RegisterPage,
        },
        {
            path: '/mijnGegevens',
            name: 'UserInfo',
            component: UserInfoPage,
        },

        //default
        {
            name: 'Home',
            component: HomePage,
        },
    ],
});