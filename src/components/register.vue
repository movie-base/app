<template>
    <div class="container">
        <form class="form-signin">
            <h2 class="form-signin-heading">Please register</h2>
            <input v-model="email" type="text" id="email" class="form-control" placeholder="Email Address" required autofocus>
            <input v-model="name" type="text" id="name" class="form-control" placeholder="Name" required>
            <input v-model="passwd" type="password" id="Password" class="form-control" placeholder="Password" required>
            <button @click.prevent="register(email, passwd, name)" class="btn btn-lg btn-primary btn-block">register</button>
            <p v-if="nothing" class="error">Please enter something</p>
            <p v-if="error" class="error">Already Exists</p>
        </form>
    </div>
</template>

<script>
    export default {
        name: "register",
        data() {
            return {
                email:'',
                passwd:'',
                name: '',
                error: false,
                nothing: false
            }
        },
        methods: {
            register: function (email, passwd, name) {
                if (!email || !passwd || !name) {
                    this.nothing = true;
                    return false;
                }
                this.axios.post('http://45.63.27.74:8080/users', {
                    "email": email,
                    'name': name,
                    "password": passwd
                })
                    .then(res => {
                        console.log(res);
                        // this.$router.replace({ name: "login" });
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