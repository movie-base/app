
<template>
    <div class="container">
        <button class="btn btn-light" @click="switchLogin">Login</button><button class="btn btn-light" @click="switchReg">Register</button>
        <form class="form-signin" v-if="showLogin">
            <h2 class="form-signin-heading">Please sign in</h2>
            <input v-model="username" type="text" id="user" class="form-control" placeholder="Email Address" required autofocus>
            <input v-model="passwd" type="password" id="Password" class="form-control" placeholder="Password" required>
            <button @click.prevent="login(username, passwd)" class="btn btn-lg btn-primary btn-block">Sign in</button>
            <p v-if="error" class="error">username or password incorrect</p>
        </form>
        <form class="form-signin" v-if="!showLogin">
            <h2 class="form-signin-heading">Please register</h2>
            <input v-model="email" type="text" id="email" class="form-control" placeholder="Email Address" required autofocus>
            <input v-model="name" type="text" id="name" class="form-control" placeholder="Name" required>
            <input v-model="passwd" type="password" id="Passwd" class="form-control" placeholder="Password" required>
            <button @click.prevent="register(email, passwd, name)" class="btn btn-lg btn-primary btn-block">register</button>
            <!--<p v-if="nothing" class="error">Please enter something</p>-->
            <p v-if="error" class="error">{{msg}}</p>
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
                email: '',
                name: '',
                msg: '',
                error: false,
                showLogin: true
            }
        },
        methods: {
            switchLogin: function() {
                this.showLogin = true;
            },
            switchReg: function() {
                this.showLogin = false;
            },
            login: function(username, passwd){
                // if (!username) {
                //     // username = "admin@moviebase.local";
                //     username = "bilibili@biu.com";
                // }
                // if (!passwd) {
                //     // passwd = "moviebase";
                //     passwd = "1234Qwer%";
                // }
                this.axios.post('http://45.63.27.74:8080/auth', {
                    // "email": "admin@moviebase.local",
                    // "password": "moviebase"
                    "email": username,
                    "password": passwd
                }).then((response) => {
                    // console.log(response.status)
                    // console.log(response.data)
                    // let token = localStorage.getItem('user-token');
                    // console.log(token);
                    localStorage.setItem('user-token', response.data.token);
                    localStorage.setItem('user-id', response.data.user.id);
                    console.log(response.data.user.id);
                    this.$router.replace({ name: "movies" });
                }).catch(error => {
                    console.log("api error:" + error);
                    this.error = true;
                    throw error;
                })
            },
            register: function (email, passwd, name) {
                if (!email || !passwd || !name) {
                    this.error = true;
                    this.msg = 'Please enter something';
                    return false;
                }
                this.axios.post('http://45.63.27.74:8080/users', {
                    "email": email,
                    'name': name,
                    "password": passwd
                })
                    .then(res => {
                        console.log(res);
                        this.login = true;
                    })
                    .catch(error => {
                        console.log(error);
                        this.error = true;
                        this.msg = 'Already Exists or Password too Simple';
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