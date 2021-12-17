// @ts-check
import { defineStore } from 'pinia'
import { getScoreAPI, getCardAPI, getItemsAPI, addCardAPI } from "../api"
import { v4 as uuidv4 } from "uuid"
import { useNickNamesStore } from './nicknames'
import * as helper from '../helper'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userName: '',
    firstName: '',
    nickName: '',
    lastName: '',
    isAdmin: false,
    email: '',
    navigation: [
        { name: 'Bingo', href: '#', current: true },
        { name: 'Leaderboard', href: '#', current: false },
        { name: 'Profile', href: '#', current: false },
        ],
    cardItems: [],
    hasBingo: false,
  }),

  actions: {
    logout() {
      this.$patch({
        userName: '',
        firstName: '',
        nickName: '',
        lastName: '',
        isAdmin: false,
        email: '',
        navigation: [],
        cardItems: [],
        hasBingo: false,
      })

      // we could do other stuff like redirecting the user
    },

    checkForAdministrator(userName) {
        let isAdministrator = false

        if (userName === 'ba738cfe-65ca-4483-b9f6-391e7fd6ba2f') {
            isAdministrator = true
            this.navigation.push({ name: 'Items', href: '#', current: false });
            this.navigation.push({ name: 'NickNames', href: '#', current: false });
        }

        return isAdministrator
    },

    insertAllItems() {
        for (var loop = 0; loop < this.cardItems.length; loop++) {
            const myCard = {
                id: this.cardItems[loop].id,
                text: this.cardItems[loop].text,
                selected: this.cardItems[loop].selected,
                sortOrder: loop,
                owner: this.cardItems[loop].owner,
            }

            addCardAPI(myCard)
        }
    },

    getUser(userName) {
        let isAdministrator = this.checkForAdministrator(userName)

        getScoreAPI(userName).then((res) => {
            debugger
            if (res) {
                localStorage.setItem(`${userName}-profile`, JSON.stringify(res))
                this.$patch({
                    userName: userName,
                    firstName: res.firstName,
                    nickName: res.nickName,
                    lastName: res.lastName,
                    isAdmin: isAdministrator,
                    email: res.email,
                })
            } else {
                const tmp = localStorage.getItem(`${userName}-profile`)
                if (tmp) {
                    let profile = JSON.parse(tmp)
                    this.$patch({
                        userName: userName,
                        firstName: profile.firstName,
                        nickName: profile.nickName,
                        lastName: profile.lastName,
                        isAdmin: isAdministrator,
                        email: profile.email,
                    })
                }
            }
        })
    },

    getCard(userName) {
        getCardAPI(userName).then((res) => {
            if (res && res.length > 0) {
                console.log("Card from database")
                res.sort(function(a, b) {
                    return a.sortOrder - b.sortOrder;
                })
                this.cardItems = res
                this.$patch({hasBingo: helper.checkForBingo(res)})
                localStorage.setItem(userName, JSON.stringify(res))
            } else {
                const tmp = localStorage.getItem(userName)
                if (tmp) {
                    console.log("Card from local storage")
                    this.cardItems = JSON.parse(tmp)
                    this.$patch({hasBingo: helper.checkForBingo(this.cardItems)})
                } else {
                    // try to get from server
                    getItemsAPI().then((res) => {
                        console.log("Card created")
                        helper.shuffle(res)
                        res.length = 25 // only keep 25 items
                        for (var loop = 0; loop < res.length; loop++) {
                            res[loop].id = uuidv4()
                            res[loop].selected = false
                            res[loop].synced = false
                            res[loop].sortOrder = loop
                            res[loop].owner = userName
                        }
                        localStorage.setItem(userName, JSON.stringify(res))
                        this.cardItems = res
                        this.insertAllItems()
                        this.$patch({hasBingo: helper.checkForBingo(this.cardItems)})
                    })
                }
            }
        })
    },
    
    async login(userName, cachedCreds) {
        const nickNames = useNickNamesStore()
        this.getUser(userName)
        this.getCard(userName)
        nickNames.getNickNames()
      }
    },
})
