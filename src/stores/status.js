// @ts-check
import { defineStore } from 'pinia'

export const useStatusStore = defineStore({
  id: 'status',
  state: () => ({
    online: true
  }),

    actions: {
        logout() {
            this.$patch({
                online: false
            })

            // we could do other stuff like redirecting the user
        },

        updateStatus(online) {
            this.$patch({
                online: online,
            })
        }
    }

})

