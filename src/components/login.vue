<template>
    <div class="container">
        <form class="form-signin">
            <h2 class="form-signin-heading">Please sign in</h2>
            <input type="text" id="user" class="form-control" placeholder="Username" required autofocus>
            <input type="password" id="Password" class="form-control" placeholder="Password" required>
            <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </form>
    </div>
</template>

<script>
    export default {
        name: "login"
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
</style>