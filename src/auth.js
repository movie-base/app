export default {

    getToken () {
        // return localStorage.token
        return localStorage.getItem('user-token')
    },

    logout () {
        // delete localStorage.token
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-id');
        this.$router.replace({ name: "login" });
    },

    loggedIn () {
        // return !!localStorage.token
        let token = localStorage.getItem('user-token');
        // console.log(token);
        if (token) {
            // console.log('true')
            return true;
        }
        // console.log('false')
        return false;
    }
}
