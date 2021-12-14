<script setup>
    import { ref } from 'vue'
    import { getItemsAPI } from '../api'

    defineProps({
    name: String
    })

    const items = ref([])
    const hasBingo = ref(false)

    function checkForBingo() {
        let l1, l2, index
        let won = false

        // Check Horizontals
        l1 = 0
        while (!won && l1 < 5)
        {
            won = true
            index = l1
            for (l2 = 0; l2 < 5; l2++)
            {
                if (!items.value[index].selected) {
                    won = false
                    break
                }
                index += 5
            }
            l1++
        }

        // Check Verticals
        l1 = 0
        while (!won && l1 <= 20)
        {
            won = true
            index = l1
            for (l2 = 0; l2 < 5; l2++)
            {
                 if (!items.value[index].selected) {
                    won = false
                    break
                }
                index++
            }
            l1 += 5
        }

        // Check Diagonals
        const ary = [[4, 8, 12, 16, 20], [0, 6, 12, 18, 24]]
        l1 = 0
        while (!won && l1 < 2)
        {
            won = true
            for (index = 0; index < 5; index++)
            {
                if (!items.value[ary[l1][index]].selected) {
                    won = false
                    break
                }
            }
            l1++
        }
        console.log(won)
        hasBingo.value = won
    }

    function toggleSelect(findId) {
        const result = items.value.find( ({ id }) => id === findId );
        result.selected = !result.selected;
        checkForBingo()
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
        res.length = 25
        items.value = res
    })
</script>

<template>
    <div>
        <div class="grid grid-flow-col grid-cols-5 grid-rows-5">
            <button v-for="item in items" :key="item.id" class="border" v-bind:class="[{'bg-indigo-500': item.selected}, {'text-white': item.selected}]" @click="toggleSelect(item.id)">
                {{ item.text }}
            </button>
        </div>
        <div v-if="hasBingo">
            BINGO 
        </div>
    </div>
</template>

<style scoped>
.selected {
    background-color: green;
}
</style>