<script setup>
import { ref } from "vue"
import { deleteCardAPI, syncCardAPI, getCardAPI, syncScoreAPI } from "../api"
import { useUserStore } from "../stores/user"
import * as helper from "../helper"

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

function toggleSelect(findId) {
  if (props.canEdit) {
    const result = props.cardItems.find(({ id }) => id === findId)
    result.selected = !result.selected
    myUser.hasBingo = helper.checkForBingo(props.cardItems)
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
          bg-red-500
          hover:bg-red-700
          text-white
          font-bold
          border border-red-700
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
          { 'bg-indigo-500': item.selected && props.canEdit },
          { 'text-white': item.selected && props.canEdit },
          { 'bg-red-200': item.selected && !props.canEdit },
          { 'text-indigo-500': item.selected && !props.canEdit },
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
