// @ts-check
import { defineStore } from 'pinia'
import { getNickNamesAPI } from "../api"

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
            const tmp = localStorage.getItem('nicknames')

            if (tmp) {
                this.$patch({
                    items: JSON.parse(tmp),
                })
            } else {
                getNickNamesAPI().then((res) => {
                    localStorage.setItem('nicknames', JSON.stringify(res))
                    this.$patch({
                        items: res,
                    })
                })
            }
        },
    }

})

