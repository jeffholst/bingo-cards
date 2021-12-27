// @ts-check
import { defineStore } from 'pinia'
import { getScoreAPI, getCardAPI, getItemsAPI, addCardAPI, syncPendingItems, syncPendingScores, getCardByOwnerAPI, getGamesAPI, getGameAPI, addScoreAPI } from "../api"
import { v4 as uuidv4 } from "uuid"
import { useNickNamesStore } from './nicknames'
import * as helper from '../helper'
import { get, set } from 'idb-keyval';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userName: '',
    firstName: '',
    nickName: '',
    lastName: '',
    isAdmin: false,
    email: '',
    navigation: [],
    cardItems: [],
    hasBingo: false,
    needsSync: false,
    game: {}
  }),

  actions: {
    signIn() {
        this.$patch({ 
        userName: '',
        firstName: '',
        nickName: '',
        lastName: '',
        isAdmin: false,
        email: '',
        navigation: [
                { name: 'My Card', href: '#', current: true },
                { name: 'Leaderboard', href: '#', current: false },
                { name: 'Profile', href: '#', current: false },
            ],
        cardItems: [],
        hasBingo: false,
        needsSync: false,
        game: {}
        })
    },
    
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
        needsSync: false,
        game: {}
      })

      // we could do other stuff like redirecting the user
    },

    checkForAdministrator(userName) {
        let isAdministrator = false

        if (userName === 'ba738cfe-65ca-4483-b9f6-391e7fd6ba2f') {
            isAdministrator = true
            this.navigation.push({ name: 'Games', href: '#', current: false });
            this.navigation.push({ name: 'Items', href: '#', current: false });
            this.navigation.push({ name: 'NickNames', href: '#', current: false });
        }

        return isAdministrator
    },

    insertAllItems(gameID) {
        for (var loop = 0; loop < this.cardItems.length; loop++) {
            const myCard = {
                id: this.cardItems[loop].id,
                text: this.cardItems[loop].text,
                selected: this.cardItems[loop].selected,
                sortOrder: loop,
                synced: this.cardItems[loop].synced,
                owner: this.cardItems[loop].owner,
                gameID: gameID,
            }
            addCardAPI(myCard)
        }
    },

    async getUser(userName) {
        let isAdministrator = this.checkForAdministrator(userName)
        //await syncPendingScores(userName)
        const res = await getScoreAPI(userName)
        
        if (res) {
            //localStorage.setItem(`${userName}-profile`, JSON.stringify(res))
            set(`${userName}-profile`, JSON.stringify(res))
            this.$patch({
                userName: userName,
                firstName: res.firstName,
                nickName: res.nickName,
                lastName: res.lastName,
                isAdmin: isAdministrator,
                email: res.email,
            })
        } else {
            //const tmp = localStorage.getItem(`${userName}-profile`)
            const val = await get(`${userName}-profile`)
            if (val) {
                let profile = JSON.parse(val)
                this.$patch({
                    userName: userName,
                    firstName: profile.firstName,
                    nickName: profile.nickName,
                    lastName: profile.lastName,
                    isAdmin: isAdministrator,
                    email: profile.email,
                })
            } else {
                 this.$patch({
                    userName: userName,
                    firstName: '',
                    lastName: '',
                    isAdmin: isAdministrator,
                    email: '',
                })
                const profile = {
                    id: userName,
                    firstName: '',
                    nickName: '',
                    lastName: '',
                }
                set(`${userName}-profile`, JSON.stringify(profile))
                addScoreAPI(profile)
            } 
        }
    },

    async newCard(currentGame, userName) {
        const res = await getGameAPI(currentGame.id)
        
        if (res.items.items) {
            console.log("Card created 1")
            helper.shuffle(res.items.items)
            res.items.items.length = 25 // only keep 25 items
            for (var loop = 0; loop < res.items.items.length; loop++) {
                res.items.items[loop].id = uuidv4()
                res.items.items[loop].selected = false
                res.items.items[loop].synced = true
                res.items.items[loop].sortOrder = loop
                res.items.items[loop].owner = userName
            }
            //localStorage.setItem(userName, JSON.stringify(res))
            set(userName, JSON.stringify(res.items.items))
            this.cardItems = res.items.items
            this.insertAllItems(currentGame.id)
            this.$patch({hasBingo: helper.checkForBingo(this.cardItems)})
            return res.items.items
        }

        return null
    },

    async getCard(userName, currentGame) {
        //getCardAPI(userName).then((res) => {
        debugger
        const res = await getCardByOwnerAPI(userName, currentGame.id)
        if (res && res.length > 0) {
            console.log("Card from database")
            res.sort(function(a, b) {
                return a.sortOrder - b.sortOrder;
            })
            this.cardItems = res
            this.$patch({hasBingo: helper.checkForBingo(res)})
            //localStorage.setItem(userName, JSON.stringify(res))
            set(userName, JSON.stringify(res))
        } else {
            debugger
            //const tmp = localStorage.getItem(userName)
            const val = await get(userName)
            if (val) {
                const ci = JSON.parse(val)
                if ( ci.length > 0 && ci[0].gameID === currentGame.id ) {
                    console.log("Card from local storage")
                    this.cardItems = ci
                    this.$patch({hasBingo: helper.checkForBingo(this.cardItems)})
                    this.insertAllItems()
                } else {
                    console.log("Card created 2")
                    await this.newCard(currentGame, userName)
                }   
            } else {
                // Generate a new card
                console.log("Card created 3")
                await this.newCard(currentGame, userName)
            }
        }
    },
    
    async login(userName, cachedCreds) {
        const nickNames = useNickNamesStore()
        nickNames.getNickNames()
        let currentGame
        const games = await getGamesAPI()
        if (games) {
            currentGame = games.find( ({ gameOver }) => gameOver === false );
            set(`${userName}-game`, JSON.stringify(currentGame))
        } else {
            currentGame = JSON.parse(await get(`${userName}-game`))
        }
        
        this.$patch({game: currentGame})

        await this.getUser(userName)
        // Sync any pending cards from local storage before getting cards from database
        //const tmp = localStorage.getItem(userName)
        const tmp = await get(userName)
        if (tmp) {
            let cards = JSON.parse(tmp)
            await syncPendingItems(cards, userName)
        }

        this.getCard(userName, currentGame)
      }
    },
})

