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
  return value ? true : "First Name is required"
}

function isRequiredLastName(value) {
  return value ? true : "Last Name is required"
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
  <Form @submit="onSubmit" class="grid grid-cols-1 gap-y-6">
    <div>
      <Field
        name="first-name"
        type="name"
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
        "
      />
      <ErrorMessage name="first-name" class="text-red-500" />
    </div>
    <div>
      <button @click="changeNickName">'{{ nickName }}'</button>
    </div>
    <div>
      <Field
        name="last-name"
        type="name"
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
        "
      />
      <ErrorMessage name="last-name" class="text-red-500" />
    </div>
    <div>
      <button>Submit</button>
    </div>
  </Form>
</template>

<style scoped></style>
