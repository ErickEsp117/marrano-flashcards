import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import App from './App.vue'

import './presentation/styles/variables.css'
import './presentation/styles/base.css'
import './presentation/styles/animations.css'
import './presentation/styles/scrollbar.css'
import './presentation/styles/responsive.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
