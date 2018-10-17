<template>
  <div id="app">
    <router-link v-if="!loggedIn" to="/login"></router-link>
    <!--<router-link v-if="loggedIn" to="/movies"><movies/></router-link>-->
    <router-view></router-view>
    <!--<login/>-->
    <!--<movies></movies>-->
    <!--<img alt="Vue logo" src="./assets/logo.png">-->
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import login from './components/login.vue'
import movies from './components/movies.vue'
import auth from './auth'

export default {
  name: 'app',
    data () {
        return {
            loggedIn: auth.loggedIn()
        }
    },
  components: {
    // HelloWorld
      login,
      movies
  }
}
</script>


<style>
  @import './assets/bootstrap.min.css';
  @import "https://fonts.googleapis.com/icon?family=Material+Icons";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
