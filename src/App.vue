<template>
  <div id="app">
    <!--<login/>-->
    <movies></movies>
    <!--<img alt="Vue logo" src="./assets/logo.png">-->
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import login from './components/login.vue'
import movies from './components/movies.vue'

export default {
  name: 'app',
  components: {
    // HelloWorld
      login,
      movies
  }
}
</script>

<style>
  @import './assets/bootstrap.min.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
