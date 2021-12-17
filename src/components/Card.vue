<script setup>
import { ref } from "vue"
import {
  deleteCardAPI,
  syncCardAPI,
  getCardAPI,
  syncScoreAPI,
} from "../api"
import { useUserStore } from "../stores/user"

const props = defineProps({
  canEdit: Boolean,
  cardItems: Array,
  firstName: String,
  nickName: String,
  lastName: String,
  userName: String,
})

const items = ref([])
const hasBingo = ref(false)
const name = ref("")
const myUser = useUserStore()

function checkForBingo() {
  let l1, l2, index
  let won = false

  // Check Horizontals
  l1 = 0
  while (!won && l1 < 5) {
    won = true
    index = l1
    for (l2 = 0; l2 < 5; l2++) {
      if (!props.cardItems[index].selected) {
        won = false
        break
      }
      index += 5
    }
    l1++
  }

  // Check Verticals
  l1 = 0
  while (!won && l1 <= 20) {
    won = true
    index = l1
    for (l2 = 0; l2 < 5; l2++) {
      if (!props.cardItems[index].selected) {
        won = false
        break
      }
      index++
    }
    l1 += 5
  }

  // Check Diagonals
  const ary = [
    [4, 8, 12, 16, 20],
    [0, 6, 12, 18, 24],
  ]
  l1 = 0
  while (!won && l1 < 2) {
    won = true
    for (index = 0; index < 5; index++) {
      if (!props.cardItems[ary[l1][index]].selected) {
        won = false
        break
      }
    }
    l1++
  }
  myUser.hasBingo = won
}

function toggleSelect(findId) {
  if (props.canEdit) {
    const result = props.cardItems.find(({ id }) => id === findId)
    result.selected = !result.selected
    checkForBingo()
    const matches = props.cardItems.filter(({ selected }) => selected)
    const score = {
      id: myUser.userName,
      score: matches.length,
      bingo: myUser.hasBingo,
    }
    syncScoreAPI(score)
    localStorage.setItem(myUser.userName, JSON.stringify(items.value))
    syncCardAPI(findId, result.selected)
  }
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}

function initializePage() {
  /*
  getCardAPI(myUser.userName).then((res) => {
    if (res && res.length > 0) {
      console.log("Card from database")
      items.value = res
      localStorage.setItem(myUser.userName, JSON.stringify(res))
      checkForBingo()
    } else {
      const tmp = localStorage.getItem(myUser.userName)
      if (tmp) {
        console.log("Card from local storage")
        items.value = JSON.parse(tmp)
        checkForBingo()
      } else {
        // try to get from server
        getItemsAPI().then((res) => {
          console.log("Card created")
          shuffle(res)
          res.length = 25 // only keep 25 items
          for (var loop = 0; loop < res.length; loop++) {
            res[loop].id = uuidv4()
            res[loop].selected = false
            res[loop].synced = false
            res[loop].sortOrder = loop
            res[loop].owner = myUser.userName
          }
          localStorage.setItem(myUser.userName, JSON.stringify(res))
          items.value = res
          insertAllItems()
          checkForBingo()
        })
      }
    }
  })
  */
}

function deleteCard() {
    console.log("Delete card")
    const score = {
        id: props.userName,
        score: 0,
        bingo: false,
    }
    syncScoreAPI(score)
    getCardAPI(props.userName).then((res) => {
      if (res && res.length > 0) {
        for (var loop = 0; loop < res.length; loop++) {
            deleteCardAPI(res[loop].id)
        }
       
      }
    })
  }

function insertAllItems() {
  /*
  for (var loop = 0; loop < items.value.length; loop++) {
    const myCard = {
      id: items.value[loop].id,
      text: items.value[loop].text,
      selected: items.value[loop].selected,
      sortOrder: items.value[loop].sortOrder,
      owner: items.value[loop].owner,
    }

    addCardAPI(myCard)
  }
  */
}

initializePage()
</script>

<template>
  <div>
    <header>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold leading-tight text-gray-900">
          {{ props.firstName }} '{{ props.nickName }}' {{ props.lastName }}
        </h1>
      </div>
    </header>
    <div v-if="myUser.isAdmin">
      <button
        class="
          bg-blue-500
          hover:bg-blue-700
          text-white
          font-bold
          py-2
          px-4
          border border-blue-700
          rounded
        "
        type="button"
        @click="deleteCard"
      >
        Delete User Card
      </button>
    </div>
    <div class="grid grid-flow-col grid-cols-5 grid-rows-5">
      <button
        v-for="item in props.cardItems"
        :key="item.id"
        class="border"
        v-bind:class="[
          { 'bg-indigo-500': item.selected },
          { 'text-white': item.selected },
        ]"
        @click="toggleSelect(item.id)"
      >
        {{ item.text }}
      </button>
    </div>
    <div v-if="hasBingo">BINGO</div>
  </div>
</template>

<style scoped>
.selected {
  background-color: green;
}
</style>
