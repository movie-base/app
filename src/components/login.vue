
<template>
    <div class="container">
        <form class="form-signin">
            <h2 class="form-signin-heading">Please sign in</h2>
            <input v-model="username" type="text" id="user" class="form-control" placeholder="Username" required autofocus>
            <input v-model="passwd" type="password" id="Password" class="form-control" placeholder="Password" required>
            <button @click.prevent="login(username, passwd)" class="btn btn-lg btn-primary btn-block">Log in</button>
            <button @click.prevent="signup(username, passwd)" class="btn btn-lg btn-primary btn-block">Sign up</button>
            <br/>
            <li v-for="e in errors" :key="e.code">
                {{ e.message }}
            </li>
        </form>
    </div>
</template>

<script>
// import auth from '../auth'
export default {
  name: 'login',
  data() {
    return {
      username: '',
      passwd: '',
      errors: [],
    };
  },
  methods: {
    login: function(username, passwd) {
      this.axios
        .post('http://45.63.27.74:8080/auth', {
          email: username,
          password: passwd,
        })
        .then(response => {
          console.log(response.data);
          localStorage.setItem('user-token', response.data.token);
          this.$router.replace({ name: 'movies' });
        })
        .catch(error => {
          console.log('api error:' + error);
          this.errors = [];
          error.response.data.forEach(e => this.errors.push(e));
          throw error;
        });
    },
    signup: function(username, passwd) {
      this.axios
        .post('http://45.63.27.74:8080/users', {
          email: username,
          password: passwd,
        })
        .then(response => {
          this.axios
            .post('http://45.63.27.74:8080/auth', {
              email: username,
              password: passwd,
            })
            .then(response => {
              localStorage.setItem('user-token', response.data.token);
              this.$router.replace({ name: 'movies' });
            })
            .catch(error => {
              this.errors = [];
              error.response.data.forEach(e => this.errors.push(e));
              console.log('api error:' + error);
              throw error;
            });
        })
        .catch(error => {
          this.errors = [];
          error.response.data.forEach(e => this.errors.push(e));
          console.log('api error:' + error);
          throw error;
        });
    },
  },
};
</script>

<style scoped>
.container {
  padding-top: 40px;
  padding-bottom: 40px;
  max-width: 330px;
  /*background-color: #eee;*/
}
.form-control {
  margin: 10px auto;
}
.btn {
  margin-top: 20px;
}
.error {
  margin-top: 10px;
  color: red;
}
</style>