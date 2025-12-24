import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '@/router/index.ts'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// Icons
import '@mdi/font/css/materialdesignicons.css' // MDI Icons
import { aliases, mdi } from 'vuetify/iconsets/mdi' // Import MDI logic

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

app.use(createPinia())
app.use(router)

app.use(vuetify)
app.mount('#app')
