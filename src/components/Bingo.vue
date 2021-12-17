<script setup>
    import { ref } from 'vue'
    import Card from './Card.vue'
    import { useUserStore } from '../stores/user'

    const myUser = useUserStore()
</script>

<template>
    <div>  
        <Card :can-edit='true' :card-items='myUser.cardItems' :first-name='myUser.firstName' :nick-name='myUser.nickName' :last-name='myUser.lastName' :user-name='myUser.userName'/>
    </div>
</template>

<style scoped>
</style>