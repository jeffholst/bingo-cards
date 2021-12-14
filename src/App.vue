<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'
import Card from './components/Card.vue'
import Items from './components/Items.vue'
import Profile from './components/Profile.vue'
import NickNames from './components/NickNames.vue'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/vue/outline'

const currentPage = ref('Bingo')

const navigation = [
  { name: 'Bingo', href: '#', current: true },
  { name: 'Scoreboard', href: '#', current: false },
  { name: 'Profile', href: '#', current: false },
  { name: 'Items', href: '#', current: false },
  { name: 'NickNames', href: '#', current: false },
]

function changeNav(pageName) {
  for (let loop = 0; loop < navigation.length; loop++) {
      if (navigation[loop].name === pageName) {
          navigation[loop].current = true
      } else {
          navigation[loop].current = false
      }
  }
  currentPage.value = pageName
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
              <img class="block lg:hidden h-8 w-auto" src="./assets/HCR-SM.png" alt="HCR Bingo" />
              <img class="hidden lg:block h-8 w-auto" src="./assets/HCR-SM.png" alt="HCR Bingo" />
              <h2 style="padding-left: 20px">Hidden Creek Ranch</h2>
            </div>
            <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <a v-for="item in navigation" :key="item.name" :href="item.href" :class="[item.current ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium']" :aria-current="item.current ? 'page' : undefined" @click="changeNav(item.name)">
                {{ item.name }}
              </a>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <!-- Profile dropdown -->
            <Menu as="div" class="ml-3 relative">
              <div>
                <a href="#" :class="['block px-4 py-2 text-sm text-gray-700']" @click="signOut">
                      Sign Out
                </a>
                
              </div>
             
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
          <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href" :class="[item.current ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800', 'block pl-3 pr-4 py-2 border-l-4 text-base font-medium']" :aria-current="item.current ? 'page' : undefined" @click="changeNav(item.name)">
            {{ item.name }}
          </DisclosureButton>
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="mt-3 space-y-1">
            <DisclosureButton href="#" as="a" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100" @click="signOut">
              Sign Out
            </DisclosureButton>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>

    <div class="py-10">
      <header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">
            {{ currentPage }}
          </h1>
        </div>
      </header>
      <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <!-- Replace with your content -->
          <Card v-show="currentPage === 'Bingo'" :username='user.username' />
          <Profile v-show="currentPage === 'Profile'" :username='user.username' />
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
