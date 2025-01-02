import {createRouter, createWebHashHistory} from 'vue-router';
import HomePage from '../pages/home/pageHome.vue';
import RegisterPage from '../pages/authentication/pageRegister.vue';
import LoginPage from '../pages/authentication/pageLogin.vue';
import UserInfoPage from '../pages/userInfo/pageUserInfo.vue';
import CreateCampingPage from '../pages/campings/pageCreateCamping.vue';
import CampingPage from '../pages/campings/pageCamping.vue';


const router = createRouter({
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
            path: '/login',
            name: 'Login',
            component: LoginPage,
        },
        {
            path: '/mijnGegevens',
            name: 'UserInfo',
            component: UserInfoPage,
        },
        {
            path: '/campingAanmaken',
            name: 'CreateCamping',
            component: CreateCampingPage,
        },
        {
            path: '/camping/:ID',
            name: 'CampingDetails',
            component: CampingPage,
        },

        //default
        {
            name: 'Home',
            component: HomePage,
        },
    ],
});

router.beforeEach((to, from, next) => {
    if (from.name && to.name == 'Login' && from.name !='Login') {
      localStorage.setItem('lastVisitedRoute', from.fullPath);
    }
    console.log(from.fullPath);
    next();
});


export default router;