<script setup>
import { ref } from "vue"
import {
  deleteCardAPI,
  syncCardAPI,
  getCardAPI,
  deleteScoreAPI,
  getCardByOwnerAPI,
} from "../api"
import { useUserStore } from "../stores/user"
import * as helper from "../helper"
import {  set } from 'idb-keyval';

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
  if (props.canEdit || myUser.isAdmin) {
    const result = props.cardItems.find(({ id }) => id === findId)
    result.selected = !result.selected
    let hasBingo = helper.checkForBingo(props.cardItems)
    helper.reScore(props.userName, props.cardItems, hasBingo)
    if (myUser.userName === props.userName) {
      myUser.hasBingo = hasBingo
    }
    syncCardAPI(findId, result.selected).then((res) => {
      result.synced = res
      if (myUser.userName === props.userName) {
        //localStorage.setItem(myUser.userName, JSON.stringify(props.cardItems))
        set(myUser.userName, JSON.stringify(props.cardItems)).then((val) => {
        }).catch((err) => {
        })
      }
    })
  }
}

function deleteUser() {
  deleteScoreAPI(props.userName)
}

function deleteCard() {
  const score = {
    id: props.userName,
    score: 0,
    bingo: false,
  }
  syncScoreAPI(score)
  //getCardAPI(props.userName).then((res) => {
  getCardByOwnerAPI(props.userName).then((res) => {
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
    <div v-if="props.cardItems === null">LOADING</div>
    <div v-else>
      <header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">
            {{ props.firstName }} '{{ props.nickName }}' {{ props.lastName }}
          </h1>
        </div>
      </header>
      <div v-if="myUser.isAdmin" style="padding-bottom: 20px">
        <button
          class="
            bg-red-500
            hover:bg-red-700
            text-white
            font-bold
            border border-red-700
            rounded
            py-1
            px-1
          "
          type="button"
          @click="deleteCard"
        >
          Delete User Card
        </button>
        <button
          style="margin-left: 40px"
          class="
            bg-red-500
            hover:bg-red-700
            text-white
            font-bold
            border border-red-700
            rounded
            py-1
            px-1
          "
          type="button"
          @click="deleteUser"
        >
          Delete User
        </button>
      </div>
      <div
        v-if="props.canEdit && myUser.hasBingo"
        class="text-3xl font-extrabold"
      >
        <span class="text-green-500">B</span>
        <span class="text-red-500">I</span>
        <span class="text-blue-500">N</span>
        <span class="text-yellow-500">G</span>
        <span class="text-purple-500">O</span>
        <span class="text-blue-800">!</span>
      </div>
      <div class="grid grid-flow-col grid-cols-5 grid-rows-5 bg-yellow-400 gap-1 p-2 rounded">
        <button
          v-for="item in props.cardItems"
          :key="item.id"
          class="border border-black text-sm"
          v-bind:class="[
            { 'bg-yellow-100 text-black': !item.selected },
            { 'bg-indigo-500 text-white': item.selected && props.canEdit },
            { 'bg-red-200 text-black': item.selected && !props.canEdit },
          ]"
          @click="toggleSelect(item.id)"
        >
          {{ item.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selected {
  background-color: green;
}
</style>
