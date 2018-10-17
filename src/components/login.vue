
<template>
    <div class="container">
        <form class="form-signin">
            <h2 class="form-signin-heading">Please sign in</h2>
            <input v-model="username" type="text" id="user" class="form-control" placeholder="Username" required autofocus>
            <input v-model="passwd" type="password" id="Password" class="form-control" placeholder="Password" required>
            <button @click.prevent="login(username, passwd)" class="btn btn-lg btn-primary btn-block">Sign in</button>
            <p v-if="error" class="error">username or password incorrect</p>
        </form>
    </div>
</template>

<script>
    // import auth from '../auth'
    export default {
        name: "login",
        data() {
            return {
                username:'',
                passwd:'',
                error: false
            }
        },
        methods: {
            login: function(username, passwd){
                // console.log(username, passwd);
                this.axios.post('http://45.63.27.74:8080/auth', {
                    "email": "admin@moviebase.local",
                    "password": "moviebase"
                }).then((response) => {
                    // console.log(response.status)
                    // console.log(response.data)
                    // let token = localStorage.getItem('user-token');
                    // console.log(token);
                    localStorage.setItem('user-token', response.data.token);
                    // console.log(response.data.token);
                    // localStorage.token = response.data.token;
                    this.$router.replace({ name: "movies" });
                }).catch(error => {
                    console.log("api error:" + error);
                    this.error = true;
                    throw error;
                })
            }
        }
    }
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