<script setup>
    import { ref } from 'vue'
    import { getItemsAPI, addItemAPI, deleteItemAPI, getGamesAPI, getGameAPI } from '../api'
    import { v4 as uuidv4 } from 'uuid';

    const games = ref([])
    const items = ref([])
    const newItem = ref('')
    const selectedGame = ref('')

    function removeItem(id) {
        items.value = items.value.filter(item => item.id !== id)
        deleteItemAPI(id)
    }

    function addItem() {
        if (newItem.value) {
            const item = { id: uuidv4(), text: newItem.value, gameID: selectedGame.value };
            items.value.push(item)
            addItemAPI(item)
            newItem.value = ''
        }
    }

    function onChange(event) {
        const game = getGameAPI(event.target.value).then(res => {
            if (res.items.items) items.value = res.items.items
            else items.value = []
        })
    }

    const propComparator = (propName) =>
  (a, b) => a[propName] == b[propName] ? 0 : a[propName] < b[propName] ? -1 : 1

    getGamesAPI().then(res => {
        games.value = res
    })

    // getItemsAPI().then(res => {
    //     res.sort(propComparator('text'))
    //     items.value = res
    // })

</script>

<template>
    <div>
        <select v-model="selectedGame" @change="onChange($event)">
            <option disabled value="">Please select one</option>
            <option v-for="game in games" :value="game.id">{{ game.name }}</option>
        </select>
        <h1>Items: {{items.length}}</h1>
        <input v-model="newItem" @keyup.enter="addItem" class="border-2">
        <button @click="addItem">Add Item</button>
        <div v-for="item in items" :key="item.id">
            {{ item.text }} <button @click="removeItem(item.id)">X</button>
        </div>
    </div>
</template>

<style scoped>
</style>