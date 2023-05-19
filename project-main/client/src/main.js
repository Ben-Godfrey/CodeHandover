import { createApp } from 'vue'
//import App from './App.vue'
import MyApp from './App.vue'

import './assets/main.css'

//createApp(App).mount('#app')
new Vue({
    render: h => h(MyApp)
  }).$mount('#chatContainer')
