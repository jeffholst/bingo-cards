<script setup>
    import { ref } from 'vue'
    import { getItemsAPI, addCardAPI, syncCardAPI, getCardAPI } from '../api'
    import { v4 as uuidv4 } from 'uuid';

    const props = defineProps({
        username: String
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
        hasBingo.value = won
    }

    function toggleSelect(findId) {
        const result = items.value.find( ({ id }) => id === findId );
        result.selected = !result.selected;
        checkForBingo()
        localStorage.setItem(props.username, JSON.stringify(items.value))
        syncCardAPI(findId, result.selected)
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
    
    function initializePage() {
        getCardAPI(props.username).then(res => {
            if (res.length > 0) {
                console.log("Card from database")
                items.value = res
                localStorage.setItem(props.username, JSON.stringify(res))
                checkForBingo()
            }
            else {
                const tmp = localStorage.getItem(props.username);
                if (tmp) {
                    console.log("Card from local storage")
                    items.value = JSON.parse(tmp)
                    checkForBingo()
                } else {
                    // try to get from server   
                    getItemsAPI().then(res => {
                        console.log("Card created")
                        shuffle(res);
                        res.length = 25 // only keep 25 items
                        for (var loop = 0; loop < res.length; loop++) {
                            res[loop].id = uuidv4()
                            res[loop].selected = false
                            res[loop].synced = false
                            res[loop].sortOrder = loop
                            res[loop].owner = props.username
                        }
                        localStorage.setItem(props.username, JSON.stringify(res))
                        items.value = res
                        insertAllItems()
                        checkForBingo()
                    })
                }
            }
        })
    }

    function insertAllItems() {
        for (var loop = 0; loop < items.value.length; loop++) {

            const myCard = { id: items.value[loop].id,
                text: items.value[loop].text,
                selected: items.value[loop].selected,
                sortOrder: items.value[loop].sortOrder,
                owner: items.value[loop].owner} 

            addCardAPI(myCard)
        }
    }

    initializePage()
    
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