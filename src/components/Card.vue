<script setup>
    import { ref } from 'vue'

    defineProps({
    name: String
    })

    const items = [ {text: 'Shotgun a beer', id: 1}, 
                    {text: 'Buy a new car', id: 2}, 
                    {text: 'Buy a new house', id: 3}, 
                    {text: 'Buy a new house', id: 4}, 
                    {text: 'Buy a new house', id: 5}, 
                    {text: 'Buy a new house', id: 6},
                    {text: 'Shotgun a beer', id: 7}, 
                    {text: 'Buy a new car', id: 8}, 
                    {text: 'Buy a new house', id: 9}, 
                    {text: 'Buy a new house', id: 10}, 
                    {text: 'Buy a new house', id: 11}, 
                    {text: 'Buy a new house', id: 12},
                    {text: 'Buy a new house', id: 13}, 
                    {text: 'Buy a new house', id: 14}, 
                    {text: 'Buy a new house', id: 15}, 
                    {text: 'Buy a new house', id: 16},
                    ]
</script>

<template>
    <div class="grid grid-flow-col grid-cols-4 grid-rows-4 gap-4">
        <div v-for="item in items" :key="item.id">
            {{ item.text}}
        </div>
    </div>
</template>

<style scoped>
</style>