<template>
    <div class="content"> Hello There</div>
    <p>{{ currentUserGreetName }}</p>
</template>
<script>
import { useUserStore } from '@/stores/userStore';
export default{
    name: 'HomePage',
    data() {
        return {
        userStore: useUserStore(),
        };
    },
    computed: {
        currentUserGreetName() {
        return this.userStore.currentUserGreetName;
        },
    },
};
</script>
<style>

</style>
