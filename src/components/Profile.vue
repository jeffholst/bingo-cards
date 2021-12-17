<script setup>
import { ref, watchEffect } from "vue"
import { syncScoreAPI } from "../api"
import { v4 as uuidv4 } from "uuid"
import { Field, Form, ErrorMessage } from "vee-validate"
import { useUserStore } from '../stores/user'
import { useNickNamesStore } from '../stores/nicknames'

const emit = defineEmits(["closeProfile"])

const myUser = useUserStore()
const nickNames = useNickNamesStore()
// We have local versions of these because user may not hit Save
const firstName = ref(myUser.firstName)
const nickName = ref(myUser.nickName)
const lastName = ref(myUser.lastName)

watchEffect(() => firstName.value = myUser.firstName)
watchEffect(() => nickName.value = myUser.nickName)
watchEffect(() => lastName.value = myUser.lastName)

function isRequiredFirstName(value) {
  return value ? true : "Looks like you forgot yer first name"
}

function isRequiredLastName(value) {
  return value ? true : "Looks like you forgot yer last name"
}

function onSubmit(values) {
  const score = {
    id: myUser.userName,
    firstName: firstName.value,
    nickName: nickName.value,
    lastName: lastName.value,
  }
  syncScoreAPI(score)
  localStorage.setItem(`${myUser.username}-profile`, JSON.stringify(score))
  myUser.firstName = firstName.value
  myUser.nickName = nickName.value
  myUser.lastName = lastName.value
  emit("closeProfile")
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

function changeNickName() {
  nickName.value = nickNames.items[getRandomInt(nickNames.items.length)].text
}

</script>

<template>
  <div>
    <header>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold leading-tight text-gray-900">Profile</h1>
        <h1>{{ myUser.email }}</h1>
      </div>
    </header>
    <Form @submit="onSubmit" class="grid grid-cols-1 gap-y-6">
      <p class="text-left">
        <Field
          v-model="firstName"
          name="first-name"
          type="name"
          :rules="isRequiredFirstName"
          placeholder="What's yer first name partner?"
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
          "
        />
        <ErrorMessage
          name="first-name"
          class="text-red-500"
          style="padding-left: 18px"
        />
      </p>
      <div class="text-lg">YER COWBOY/COWGIRL NICKNAME</div>
      <div>
        <button
          type="button"
          @click="changeNickName"
          class="
            bg-transparent
            hover:bg-blue-500
            text-blue-700
            font-semibold
            hover:text-white
            py-2
            px-4
            border border-blue-500
            hover:border-transparent
            rounded
          "
        >
          '{{ nickName }}'
        </button>
      </div>
      <p class="text-left">
        <Field
          v-model="lastName"
          name="last-name"
          type="name"
          :rules="isRequiredLastName"
          placeholder="What's yer last name partner?"
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
          "
        />
        <ErrorMessage
          name="last-name"
          class="text-red-500"
          style="padding-left: 18px"
        />
      </p>
      <div>
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
        >
          Save
        </button>
      </div>
    </Form>
  </div>
</template>

<style scoped></style>
