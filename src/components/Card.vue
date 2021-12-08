<script setup>
    import { ref } from 'vue'

    defineProps({
    name: String
    })

    const items = [{text: 'Shotgun a beer', id: 1}, {text: 'Buy a new car', id: 2}, {text: 'Buy a new house', id: 3}]
</script>

<template>
    <ul id="example-1">
        <li v-for="item in items" :key="item.id">
            {{ item.text }}
        </li>
    </ul>
</template>

<style scoped>
</style>