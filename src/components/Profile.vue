<script setup>
import { ref } from "vue"
 import { getNickNamesAPI } from '../api'
import { v4 as uuidv4 } from "uuid"
import { Field, Form, ErrorMessage } from "vee-validate"

const props = defineProps({
  username: String,
})

const items = ref([])
const nickName = ref("")

function isRequiredFirstName(value) {
  return value ? true : "Looks like you forgot yer first name"
}

function isRequiredLastName(value) {
  return value ? true : "Looks like you forgot yer last name"
}

function onSubmit(values) {
  console.log(values)
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function changeNickName() {
    nickName.value = items.value[getRandomInt(items.value.length)].text
}

getNickNamesAPI().then(res => {
    items.value = res
    changeNickName()
})

</script>

<template>
  <Form @submit.prevent="onSubmit" class="grid grid-cols-1 gap-y-6">
    <p class="text-left">
      <Field
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
      <ErrorMessage name="first-name" class="text-red-500" style="padding-left: 18px;"/>
    </p>
    <div class="text-lg">
        Yer Cowboy Name
    </div>
    <div>
      <button type="button" @click="changeNickName" class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">'{{ nickName }}'</button>
    </div>
    <p class="text-left">
      <Field
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
      <ErrorMessage name="last-name" class="text-red-500" style="padding-left: 18px;" />
    </p>
    <div>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Giddy Up</button>
    </div>
  </Form>
</template>

<style scoped></style>
