<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import HelloWorld from './components/HelloWorld.vue'
import { ref, computed } from 'vue'
import Bingo from './components/Bingo.vue'
import Scorecard from './components/Scorecard.vue'
import Items from './components/Items.vue'
import Profile from './components/Profile.vue'
import NickNames from './components/NickNames.vue'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/vue/outline'
import { Hub } from 'aws-amplify';
import { getScoreAPI, addScoreAPI, syncPendingItems, syncPendingScores } from './api'
import { Auth } from "aws-amplify";
import { useUserStore } from './stores/user'
import { useNickNamesStore } from "./stores/nicknames"
import { useStatusStore } from "./stores/status"
import * as helper from "./helper"
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { get, set } from 'idb-keyval';

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const version = import.meta.env.VITE_APP_VERSION
const currentPage = ref('My Card')
const firstName = ref('')
const lastName = ref('')
const nickName = ref('')
const myUser = useUserStore()
const nickNames = useNickNamesStore()
const status = useStatusStore()
const initials = computed(() => `${myUser.firstName.substring(0, 1)}${myUser.lastName.substring(0, 1)}`)

window.addEventListener('offline', function(e) { console.log('offline'); status.updateStatus(false)}) 

window.addEventListener('online', function(e) { console.log('online'); status.updateStatus(true)});

const myTimeout = setInterval(function() {syncPendingItems(myUser.cardItems, myUser.userName)}, 5000);

async function checkForCurrentlyAuthenticated() {
    try {
        const authUser = await Auth.currentAuthenticatedUser();
        myUser.signIn()
        status.updateStatus(true)
        myUser.login(authUser.username, true)
        goToBingoNav()
    } catch {
    }
}

// Only true when localStorage auth is still valid
checkForCurrentlyAuthenticated()

const listener = (data) => {
  switch (data.payload.event) {
    case 'signIn':
      console.log('user singned in')
      userSignedIn(data)
      break;
    case 'signUp':
      console.log('user signed up');
      break;
    case 'signOut':
      logoutUser()
      console.log('user signed out');
      break;
    case 'signIn_failure':
      console.log('user sign in failed');
      break;
    default:
      console.log('unknown event');
      break;
  }
}

Hub.listen('auth', listener);

function changeNav(pageName) {

  if (currentPage.value === "Profile" && myUser.needsSync) {
    helper.updateProfile()
    myUser.needsSync = false
  }

  for (let loop = 0; loop < myUser.navigation.length; loop++) {
      if (myUser.navigation[loop].name === pageName) {
          myUser.navigation[loop].current = true
      } else {
          myUser.navigation[loop].current = false
      }
  }
  currentPage.value = pageName

  if (pageName != "Profile") syncPendingScores(myUser.userName)
}

function goToBingoNav() {
  changeNav('My Card')
}

async function userSignedIn(data) {
  myUser.signIn()
  status.updateStatus(true)
  await myUser.login(data.payload.data.username, false)

  getScoreAPI(data.payload.data.username).then(res => {
    // If user is not in database then let's add them
    if (!res) {
      const score = {
        id: data.payload.data.username,
        firstName: '',
        nickName: '',
        lastName: '',
        email: data.payload.data.attributes.email,
        score: 0,
        bingo: false
      }
      addScoreAPI(score)
      myUser.userName = data.payload.data.username
      myUser.firstName = ''
      myUser.nickName = ''
      myUser.lastName = ''
      changeNav('Profile')
    }
    else {
      if (!res.firstName) {
        changeNav('Profile')
      }
      else {
        firstName.value = res.firstName
        lastName.value = res.lastName
        nickName.value = res.nickName
      }
    }
  })
}

function logoutUser() {
  goToBingoNav()
  myUser.logout()
  status.logout()
}

</script>

<template>
  <authenticator>
    <template v-slot="{ user, signOut }">
    <!-- Start Tailwind CSS -->
    <div class="min-h-full">
    <Disclosure as="nav" class="bg-white border-b border-gray-200" v-slot="{ open }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img class="block lg:hidden h-10 w-auto" src="/HCR-SM.png" alt="HCR Bingo" />
              <img class="hidden lg:block h-12 w-auto" src="/HCR-SM.png" alt="HCR Bingo" />
              <h2 class="block lg:hidden text-sm text-black" style="padding-left: 20px">Hidden Creek Ranch Bingo</h2>
              <h2 class="hidden lg:block font-bold text-lg text-black" style="padding-left: 20px">Hidden Creek Ranch Bingo</h2>
              
            </div>
            <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <a v-for="item in myUser.navigation" :key="item.name" :href="item.href" :class="[item.current ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium']" :aria-current="item.current ? 'page' : undefined" @click="changeNav(item.name)">
                {{ item.name }}
              </a>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <!-- Profile dropdown -->
            <Menu as="div" class="ml-3 relative">
              <div>
                <MenuButton class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span class="sr-only">Open user menu</span>
                  <div class="w-10 h-10 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-700 font-bold">
                    {{ initials}}
                  </div>
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-200" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem>
                    <a href="#" @click="signOut" class="block px-4 py-2 text-sm text-gray-700">
                      Sign Out
                    </a>
                  </MenuItem>
                  <h1 class="text-gray-300">{{ myUser.email}}</h1>
                  <h1 class="text-gray-300">Version: {{ version }}</h1>
                  <h1 v-if="status.online" class="text-gray-300">Online</h1>
                  <h1 v-else class="text-gray-300">Offline</h1>
                </MenuItems>
              </transition>
            </Menu>
          </div>
          <div class="-mr-2 flex items-center sm:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton class="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span class="sr-only">Open main menu</span>
              <MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <DisclosureButton v-for="item in myUser.navigation" :key="item.name" as="a" :href="item.href" :class="[item.current ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800', 'block pl-3 pr-4 py-2 border-l-4 text-base font-medium']" :aria-current="item.current ? 'page' : undefined" @click="changeNav(item.name)">
            {{ item.name }}
          </DisclosureButton>
        </div>
         <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="mt-3 space-y-1">
             <h1 class="text-gray-300">{{ myUser.email}}</h1>
            <h1 class="text-gray-300">Version: {{ version }}</h1>
            <h1 v-if="status.online" class="text-gray-300">Online</h1>
            <h1 v-else class="text-gray-300">Offline</h1>
            <DisclosureButton href="#" as="a" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100" @click="signOut">
              Sign Out
            </DisclosureButton>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>


    <div class="py-10">
      <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <!-- Replace with your content -->
          <Bingo v-show="currentPage === 'My Card'"/>
          <Profile v-show="currentPage === 'Profile'" @close-profile="goToBingoNav"/>
          <Scorecard v-show="currentPage === 'Leaderboard'"/>
          <Items v-if="currentPage === 'Items'"/>
          <NickNames v-if="currentPage === 'NickNames'"/>
          <!-- /End replace -->
        </div>
      </main>
    </div>
  </div>
    <!-- End Tailwind CSS -->
    </template>
  </authenticator>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
