<script setup>
    import { ref } from 'vue'
    import { getItemsAPI } from '../api'

    defineProps({
    name: String
    })
    const items = ref([])
    /*
    const items = ref([ {text: 'Shotgun a beer', id: 1, selected: true}, 
                    {text: 'Buy a new car', id: 2, selected: false}, 
                    {text: 'Buy a new house', id: 3, selected: false}, 
                    {text: 'Buy a new house', id: 4, selected: false}, 
                    {text: 'Buy a new house', id: 5, selected: false}, 
                    {text: 'Buy a new house', id: 6, selected: false},
                    {text: 'Shotgun a beer', id: 7, selected: false}, 
                    {text: 'Buy a new car', id: 8, selected: false}, 
                    {text: 'Buy a new house', id: 9, selected: false}, 
                    {text: 'Buy a new house', id: 10, selected: false}, 
                    {text: 'Buy a new house', id: 11, selected: false}, 
                    {text: 'Buy a new house', id: 12, selected: false},
                    {text: 'Buy a new house', id: 13, selected: false}, 
                    {text: 'Buy a new house', id: 14, selected: false}, 
                    {text: 'Buy a new house', id: 15, selected: false}, 
                    {text: 'Buy a new house', id: 16, selected: false},
                    ])
    */
    function toggleSelect(findId) {
        const result = items.value.find( ({ id }) => id === findId );
        result.selected = !result.selected;
    }

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
    }
    getItemsAPI().then(res => {
        shuffle(res);
        console.log(res.length)
        res.length = 25
        items.value = res
    })
</script>

<template>
    <div class="grid grid-flow-col grid-cols-5 grid-rows-5">
        <button v-for="item in items" :key="item.id" class="border" v-bind:class="[{'bg-indigo-500': item.selected}, {'text-white': item.selected}]" @click="toggleSelect(item.id)">
            {{ item.text}}
        </button>
    </div>
</template>

<style scoped>
.selected {
    background-color: green;
}
</style>