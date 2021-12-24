// @ts-check
import { defineStore } from 'pinia'
import { getNickNamesAPI } from "../api"
import { get, set } from 'idb-keyval';

export const useNickNamesStore = defineStore({
  id: 'nicknames',
  state: () => ({
    items: []
  }),

    actions: {
        logout() {
            this.$patch({
                items: []
            })

            // we could do other stuff like redirecting the user
        },

        async getNickNames() {
            await getNickNamesAPI().then((res) => {
                if (res) {
                    //localStorage.setItem('nicknames', JSON.stringify(res))
                    set('nicknames', JSON.stringify(res))
                    this.$patch({
                        items: res,
                    })
                }
                else {
                    //const tmp = localStorage.getItem('nicknames')
                    const tmp = get('nicknames').then((val) => {
                        if (val) {
                        this.$patch({
                            items: val,
                        })
                    }
                    })
                }
            })
        },
    }

})

