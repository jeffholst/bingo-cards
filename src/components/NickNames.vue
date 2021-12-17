<script setup>
    import { ref } from 'vue'
    import { addNickNameAPI, deleteNickNameAPI } from '../api'
    import { v4 as uuidv4 } from 'uuid';
    import { useNickNamesStore } from '../stores/nicknames'

    const newItem = ref('')
    const nickNames = useNickNamesStore()

    function removeItem(id) {
        nickNames.items = nickNames.items.filter(item => item.id !== id)
        deleteNickNameAPI(id)
    }

    function addItem() {
        if (newItem.value) {
            const item = { id: uuidv4(), text: newItem.value };
            nickNames.items.push(item)
            addNickNameAPI(item)
            newItem.value = ''
        }
    }

    const propComparator = (propName) =>
  (a, b) => a[propName] == b[propName] ? 0 : a[propName] < b[propName] ? -1 : 1

</script>

<template>
    <div>
        <h1>NickNames</h1>
        <input v-model="newItem" @keyup.enter="addItem" class="border-2">
        <button @click="addItem">Add Item</button>
        <div v-for="item in nickNames.items.sort(propComparator('text'))" :key="item.id">
            {{ item.text }} <button @click="removeItem(item.id)">X</button>
        </div>
    </div>
</template>

<style scoped>
</style>