<script setup>
import { ref, watch } from "vue"
import { syncScoreAPI } from "../api"
import { v4 as uuidv4 } from "uuid"
import { Field, Form, ErrorMessage } from "vee-validate"
import { useUserStore } from "../stores/user"
import { useNickNamesStore } from "../stores/nicknames"
import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
} from "@heroicons/vue/outline"
import { parse } from "postcss"

const myUser = useUserStore()
const nickNames = useNickNamesStore()
const nickNameIndex = ref(0)
watch(nickNames, function (nicks) {
  if (nicks.items && nicks.items.length > 0 && !myUser.nickName) myUser.nickName = nicks.items[0].text
})

function isRequiredFirstName(value) {
  return value ? true : "Required"
}

function isRequiredLastName(value) {
  return value ? true : "Required"
}

function changeNickName(change) {
  if (change != 0){
    nickNameIndex.value += change

    if (nickNameIndex.value < 0) nickNameIndex.value = nickNames.items.length - 1
    else if (nickNameIndex.value > nickNames.items.length - 1) nickNameIndex.value = 0

    myUser.nickName = nickNames.items[nickNameIndex.value].text
  }
  
  const tmp = localStorage.getItem(`${myUser.userName}-profile`)

  if (tmp )
  {
    let json = JSON.parse(tmp)
    json.firstName = myUser.firstName
    json.nickName = myUser.nickName
    json.lastName = myUser.lastName
    json.synced = false
    localStorage.setItem(`${myUser.userName}-profile`, JSON.stringify(json))
  }
  else {
    const score = {
      id: myUser.userName,
      firstName: myUser.firstName,
      nickName: myUser.nickName,
      lastName: myUser.lastName,
      synced: false,
    }
    localStorage.setItem(`${myUser.userName}-profile`, JSON.stringify(score))
  }
}

</script>

<template>
  <div>
    <Form
      class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
    >
      <div class="text-left mt-1">
        <Field
          @blur="changeNickName(0)"
          v-model="myUser.firstName"
          name="first-name"
          type="text"
          :rules="isRequiredFirstName"
          placeholder="First Name"
          class="
            block
            w-full
            shadow-sm
            py-3
            px-4
            placeholder-gray-500
            focus:ring-indigo-500 focus:border-indigo-500
            border-gray-300
            rounded-md
            border-2
          "
        />
        <ErrorMessage
          name="first-name"
          class="text-red-500"
          style="padding-left: 18px"
        />
      </div>

      <div class="text-left mt-1">
        <Field
          @blur="changeNickName(0)"
          v-model="myUser.lastName"
          name="last-name"
          type="text"
          :rules="isRequiredLastName"
          placeholder="Last Name"
          class="
            block
            w-full
            shadow-sm
            py-3
            px-4
            placeholder-gray-500
            focus:ring-indigo-500 focus:border-indigo-500
            border-gray-300
            rounded-md
            border-2
          "
        />
        <ErrorMessage
          name="last-name"
          class="text-red-500"
          style="padding-left: 18px"
        />
      </div>
      <div class="sm:col-span-2 text-left">
        <span class="text-lg text-gray-500">Nick Name: </span><span class="text-xl text-black font-bold">{{ myUser.nickName }}</span>
      </div>
      <div class="inline-flex">
        <button
          type="button"
          class="inline-flex bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-l"
          @click="changeNickName(-1)"
        >
          <ArrowCircleLeftIcon class="h-6 w-6" aria-hidden="true" />
          <span>Prev Nickname</span>
        </button>
       <button
          type="button"
          class="inline-flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
          @click="changeNickName(1)"
        >
          <span>Next Nickname</span>
          <ArrowCircleRightIcon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </Form>
  </div>
</template>

<style scoped></style>
