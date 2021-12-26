<script setup>
    import { ref } from 'vue'
    import { getGamesAPI, deleteGameAPI, addGameAPI, syncGameAPI } from '../api'
    import { v4 as uuidv4 } from 'uuid';

    const games = ref([])
    const newGame = ref('')

    function removeGame(id) {
        games.value = games.value.filter(game => game.id !== id)
        deleteGameAPI(id)
    }

    function addGame() {
        if (newGame.value) {
            const game = { id: uuidv4(), name: newGame.value, gameOver: false };
            games.value.push(game)
            addGameAPI(game)
            newGame.value = ''
        }
    }

    function enableGame(game) {
        game.gameOver = false
        syncGameAPI(game.id, false)
    }

    function disableGame(game) {
        game.gameOver = true
        syncGameAPI(game.id, true)
    }

    getGamesAPI().then(res => {
        games.value = res
    })
</script>

<template>
    <div>
        <h1>Games: {{games.length}}</h1>
        <input v-model="newGame" @keyup.enter="addGame" class="border-2">
        <button @click="addGame">Add Game</button>
        <div v-for="game in games" :key="game.id">
            {{ game.name }} 
            <button v-if="game.gameOver" class="
                          bg-transparent
                          hover:bg-blue-500
                          text-blue-700
                          font-semibold
                          hover:text-white
                          py-1
                          px-1
                          border border-blue-500
                          hover:border-transparent
                          rounded
                        " @click="enableGame(game)">Enable Game</button>
            <button v-else class="
                          bg-transparent
                          hover:bg-blue-500
                          text-blue-700
                          font-semibold
                          hover:text-white
                          py-1
                          px-1
                          border border-blue-500
                          hover:border-transparent
                          rounded
                        " @click="disableGame(game)">Disable Game</button>
            <button class="
                          bg-transparent
                          hover:bg-blue-500
                          text-blue-700
                          font-semibold
                          hover:text-white
                          py-1
                          px-1
                          border border-blue-500
                          hover:border-transparent
                          rounded
                        " @click="removeGame(game.id)">X</button>
        </div>
    </div>
</template>

<style scoped>
</style>