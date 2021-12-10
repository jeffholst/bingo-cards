<script setup>
    import { ref } from 'vue'
    import { getItemsAPI, addItemAPI, deleteItemAPI } from '../api'
    import { v4 as uuidv4 } from 'uuid';

    const items = ref([])
    const newItem = ref('')

    function removeItem(id) {
        items.value = items.value.filter(item => item.id !== id)
        deleteItemAPI(id)
    }

    function addItem() {
        if (newItem.value) {
            const item = { id: uuidv4(), text: newItem.value };
            items.value.push(item)
            addItemAPI(item)
            newItem.value = ''
        }
    }

    getItemsAPI().then(res => items.value = res)
</script>

<template>
    <h1>Admin Area</h1>
    <input v-model="newItem" @keyup.enter="addItem">
    <button @click="addItem">Add Item</button>
    <div v-for="item in items" :key="item.id">
        {{ item.text }} <button @click="removeItem(item.id)">X</button>
    </div>
</template>

<style scoped>
</style>