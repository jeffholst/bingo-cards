<script setup>
import { ref } from "vue"
import { getScoresAPI, getCardAPI } from "../api"
import * as subscriptions from "../graphql/subscriptions"
import { API, graphqlOperation } from "aws-amplify"
import Card from "./Card.vue"
import { useUserStore } from "../stores/user"

const items = ref([])
const myUser = useUserStore()
const firstName = ref("")
const nickName = ref("")
const lastName = ref("")
const cardItems = ref([])

const subscription1 = API.graphql(
  graphqlOperation(subscriptions.onUpdateScore)
).subscribe({
  next: ({ provider, value }) => getScores(),
  error: (error) => console.warn(error),
})

const subscription2 = API.graphql(
  graphqlOperation(subscriptions.onCreateScore)
).subscribe({
  next: ({ provider, value }) => getScores(),
  error: (error) => console.warn(error),
})

function getScores() {
  getScoresAPI().then((res) => {
    // Equal to SELECT * FROM res ORDER BY bing, score, firstname
    res.sort(
      (a, b) =>
        b.bingo - a.bingo || b.score - a.score || ('' + a.firstName).localeCompare(b.firstName)
    )
    items.value = res
  })
}

function clickedUser(userName, fName, nName, lName) {
  console.log(userName)
  getCardAPI(userName).then((res) => {
    console.log(res)
    if (res && res.length > 0) {
        res.sort(function(a, b) {
            return a.sortOrder - b.sortOrder;
        })
        firstName.value = fName
        nickName.value = nName
        lastName.value = lName
        cardItems.value = res
    } 
  })
}

getScores()
</script>

<template>
  <div>
    <Card
      :can-edit="false"
      :card-items="cardItems"
      :first-name="firstName"
      :nick-name="nickName"
      :last-name="lastName"
    />
    <header>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold leading-tight text-gray-900">
          Leaderboard
        </h1>
      </div>
    </header>
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div
            class="
              shadow
              overflow-hidden
              border-b border-gray-200
              sm:rounded-lg
            "
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      font-medium
                      text-gray-500
                      uppercase
                      tracking-wider
                    "
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-center text-xs
                      font-medium
                      text-gray-500
                      uppercase
                      tracking-wider
                    "
                  >
                    Squares
                  </th>
                  <th
                    scope="col"
                    class="
                      px-6
                      py-3
                      text-center text-xs
                      font-medium
                      text-gray-500
                      uppercase
                      tracking-wider
                    "
                  >
                    Bingo
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="items.id">
                  <td
                    class="
                      px-6
                      py-4
                      whitespace-nowrap
                      text-sm
                      font-medium
                      text-gray-900 text-left
                    "
                  >
                    <a
                      href="#"
                      @click="
                        clickedUser(
                          item.id,
                          item.firstName,
                          item.nickName,
                          item.lastName
                        )
                      "
                    >
                      {{ item.firstName }} '{{ item.nickName }}'
                      {{ item.lastName }}
                    </a>
                  </td>
                  <td
                    class="
                      px-6
                      py-4
                      whitespace-nowrap
                      text-sm text-gray-500 text-center
                    "
                  >
                    {{ item.score }}
                  </td>
                  <td
                    class="
                      px-6
                      py-4
                      whitespace-nowrap
                      text-sm text-gray-500 text-center
                    "
                  >
                    {{ item.bingo }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
