<script setup>
    import { ref } from 'vue'
    import { getScoresAPI} from '../api'

    const items = ref([])
    const newItem = ref('')

    getScoresAPI().then(res => {
        
        // Equal to SELECT * FROM res ORDER BY bing, score, firstname
        res.sort((a,b)=> (a.bingo - b.bingo || a.score - b.score || a.firstname - b.firstname));

        items.value = res
    })

</script>

<template>
    <div>
        <div v-for="item in items" :key="item.id">
            {{ item.firstName }} '{{ item.nickName}}' {{ item.lastName }} {{ item.score }} {{ item.bingo }}
        </div>
    </div>
</template>

<style scoped>
</style>