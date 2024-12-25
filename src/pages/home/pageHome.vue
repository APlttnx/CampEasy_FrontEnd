<template>
    <div class="content"> Hello There</div>
    <p>{{ currentUserFirstName || currentUserPrefName }}</p>
</template>
<script>
import { useUserStore } from '@/stores/userStore';
export default{
    name: 'HomePage',
    data() {
        // Accessing the store instance directly in data()
        return {
        userStore: useUserStore(),
        };
    },
    computed: {
        currentUserFirstName() {
        return this.userStore.currentUserFirstName;
        },
        currentUserPrefName() {
        return this.userStore.currentUserPrefName;
        },
    },
};
</script>
<style>

</style>
