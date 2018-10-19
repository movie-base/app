import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'

import login from './components/login.vue'
import movies from './components/movies.vue'
import register from './components/register.vue'
import auth from './auth'

Vue.use(VueRouter)
Vue.use(VueAxios, axios)

// Vue.use(VueMaterial)
Vue.config.productionTip = false


const router = new VueRouter({
  routes: [
      {path: '/', redirect: {name: "login"}},
      {path: '/login', name: 'login', component: login},
      {path: '/register', name: 'register', component: register},
      {path: '/movies', name: 'movies', component: movies}
  ]
})

new Vue({
    router,
  render: h => h(App)
}).$mount('#app')

