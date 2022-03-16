import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import specific icons */
import { fas /*possible de mettre aussi juste l icon voulu c'est meme mieux*/ } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(fas /*si plusieurs icon a prendre au lieu de fas suivre ce mdl ex: faPaperClip, faArrowLeft*/)

createApp(App)
.component('fa', FontAwesomeIcon)
.use(store)
.use(router)
.mount('#app') 