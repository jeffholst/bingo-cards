<script setup>
import { ref } from "vue"
import { getScoresAPI, getCardAPI, getCardByOwnerAPI} from "../api"
import * as subscriptions from "../graphql/subscriptions"
import { API, graphqlOperation } from "aws-amplify"
import Card from "./Card.vue"
import { useUserStore } from "../stores/user"
import { useStatusStore } from "../stores/status"

const items = ref([])
const myUser = useUserStore()
const firstName = ref("")
const nickName = ref("")
const lastName = ref("")
const cardItems = ref([])
const lastUserName = ref("")
const status = useStatusStore()

const subscription1 = API.graphql(
  graphqlOperation(subscriptions.onUpdateScore)
).subscribe({
  next: ({ provider, value }) => getScores(false),
  error: (error) => console.warn(error),
})

const subscription2 = API.graphql(
  graphqlOperation(subscriptions.onCreateScore)
).subscribe({
  next: ({ provider, value }) => getScores(false),
  error: (error) => console.warn(error),
})

function getScores(showLoading) {
  getScoresAPI().then((res) => {
    // Equal to SELECT * FROM res ORDER BY bing, score, firstname
    res.sort(
      (a, b) =>
        b.bingo - a.bingo ||
        b.score - a.score ||
        ("" + a.firstName).localeCompare(b.firstName)
    )
    items.value = res

    if (!lastUserName.value) {
      clickedUser(res[0].id, res[0].firstName, res[0].nickName, res[0].lastName, true)
    }
    else {
      let index = res.findIndex(x => x.id === lastUserName.value)
      clickedUser(
        res[index].id,
        res[index].firstName,
        res[index].nickName,
        res[index].lastName,
        showLoading,
      )
    }
  })
}

function clickedUser(userName, fName, nName, lName, showLoading) {
  console.log(userName, fName, nName, lName)
  lastUserName.value = userName
  if (showLoading) cardItems.value = null
  //getCardAPI(userName).then((res) => {
  getCardByOwnerAPI(userName).then((res) => {
    if (res) {
      res.sort(function (a, b) {
        return a.sortOrder - b.sortOrder
      })
      firstName.value = fName
      nickName.value = nName
      lastName.value = lName
      cardItems.value = res
    }
  })
}

getScores(true)
</script>

<template>
  <div>
    <div v-if="status.online">
      <Card
        :can-edit="false"
        :card-items="cardItems"
        :first-name="firstName"
        :nick-name="nickName"
        :last-name="lastName"
        :user-name="lastUserName"
      />
      <header style="padding-top: 20px">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">
            Leaderboard
          </h1>
        </div>
      </header>
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
          >
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
                  <tr
                    v-for="(item, index) in items"
                    :key="items.id"
                    :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                  >
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
                      <button
                        type="button"
                        @click="
                          clickedUser(
                            item.id,
                            item.firstName,
                            item.nickName,
                            item.lastName,
                            true
                          )
                        "
                        class="
                          bg-transparent
                          hover:bg-blue-500
                          text-blue-700
                          font-semibold
                          hover:text-white
                          py-1
                          px-1
                          border border-blue-500
                          hover:border-transparent
                          rounded
                        "
                      >
                        {{ item.firstName }} '{{ item.nickName }}'
                        {{ item.lastName }}
                      </button>
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
                      <div v-if="item.bingo">Yes</div>
                      <div v-else>No</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>Sorry you must be online to view the Leaderboard</div>
  </div>
</template>

<style scoped></style>
