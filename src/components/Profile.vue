<script setup>
import { ref } from "vue"
import { getNickNamesAPI, syncScoreAPI, getScoreAPI } from "../api"
import { v4 as uuidv4 } from "uuid"
import { Field, Form, ErrorMessage } from "vee-validate"

const props = defineProps({
  username: String,
  firstName: String,
  lastName: String,
  nickName: String,
})

const emit = defineEmits(["closeProfile"])

const items = ref([])
const nickName = ref(props.nickName)
const firstName = ref(props.firstName)
const lastName = ref(props.lastName)

function isRequiredFirstName(value) {
  return value ? true : "Looks like you forgot yer first name"
}

function isRequiredLastName(value) {
  return value ? true : "Looks like you forgot yer last name"
}

function onSubmit(values) {
  const score = {
    id: props.username,
    firstName: firstName.value,
    lastName: lastName.value,
    nickName: nickName.value,
  }
  syncScoreAPI(score)
  localStorage.setItem(`${props.username}-profile`, JSON.stringify(score))
  emit("closeProfile")
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

function changeNickName() {
  nickName.value = items.value[getRandomInt(items.value.length)].text
}

getNickNamesAPI().then((res) => {
  items.value = res
  if (!nickName.value) {
    changeNickName()
  }
})

getScoreAPI(props.username).then((res) => {
  if (res) {
    firstName.value = res.firstName
    lastName.value = res.lastName
    nickName.value = res.nickName
  } else {
    const tmp = localStorage.getItem(`${props.username}-profile`)
    if (tmp) {
      let profile = JSON.parse(tmp)
      firstName.value = profile.firstName
      lastName.value = profile.lastName
      nickName.value = profile.nickName
    }
  }
})
</script>

<template>
  <div>
    <header>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold leading-tight text-gray-900">Profile</h1>
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
          Giddy Up
        </button>
      </div>
    </Form>
  </div>
</template>

<style scoped></style>
