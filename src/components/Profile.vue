<script setup>
import { ref, watch } from "vue"
import { Field, Form, ErrorMessage } from "vee-validate"
import { useUserStore } from "../stores/user"
import { useNickNamesStore } from "../stores/nicknames"
import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
} from "@heroicons/vue/outline"
import * as helper from "../helper"

const myUser = useUserStore()
const nickNames = useNickNamesStore()
const nickNameIndex = ref(0)
const emit = defineEmits(['closeProfile'])

watch(nickNames, function (nicks) {
  if (nicks.items && nicks.items.length > 0 && !myUser.nickName)
    myUser.nickName = nicks.items[0].text
})

function isRequiredFirstName(value) {
  return value ? true : "Required"
}

function isRequiredLastName(value) {
  return value ? true : "Required"
}

function changeNickName(change) {
  nickNameIndex.value += change

  if (nickNameIndex.value < 0)
    nickNameIndex.value = nickNames.items.length - 1
  else if (nickNameIndex.value > nickNames.items.length - 1)
    nickNameIndex.value = 0

  myUser.nickName = nickNames.items[nickNameIndex.value].text

  myUser.needsSync = true
}

function playBingo() {
  emit('closeProfile')
}

</script>

<template>
  <div>
    <div
      class="
        flex
        items-center
        bg-blue-500
        text-white text-sm
        font-bold
        px-4
        py-3
      "
      role="alert"
    >
      <svg
        class="fill-current w-4 h-4 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"
        />
      </svg>
      <p>Enter your real first and last name then select a nickname.  When done click the "Play Bingo" button.</p>
    </div>
    <Form class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
      <div class="text-left mt-1">
        <Field
          @blur="myUser.needsSync = true"
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
          @blur="myUser.needsSync = true"
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
        <span class="text-lg text-gray-500">Nickname: </span
        ><span class="text-xl text-black font-bold">{{ myUser.nickName }}</span>
      </div>
      <div class="inline-flex">
        <button
          type="button"
          class="
            inline-flex
            bg-purple-500
            hover:bg-purple-700
            text-white
            font-bold
            py-2
            px-4
            rounded-l
          "
          @click="changeNickName(-1)"
        >
          <ArrowCircleLeftIcon class="h-6 w-6" aria-hidden="true" />
          <span>Prev Nickname</span>
        </button>
        <button
          type="button"
          class="
            inline-flex
            bg-yellow-500
            hover:bg-yellow-700
            text-white
            font-bold
            py-2
            px-4
            rounded-r
          "
          @click="changeNickName(1)"
        >
          <span>Next Nickname</span>
          <ArrowCircleRightIcon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div class="sm:col-span-2 text-left">
        <button
          type="button"
          class="
            inline-flex
            bg-blue-500
            hover:bg-blue-700
            text-white
            font-bold
            py-2
            px-4
            rounded
          "
          @click="playBingo"
        >
        Play Bingo
        </button>
      </div>
    </Form>
  </div>
</template>

<style scoped></style>
