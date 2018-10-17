<template>
    <div class="container">
        <div v-if="watchedPopup">
            <div class="popup-background" @click="reset()"></div>
            <div class="popup">
                <p>Add a movie that you have watched</p>
                <input class="form-control" placeholder="movie name">
                <button class="btn btn-primary">Submit</button>
            </div>
        </div>
        <p class="title">Watched Movie <button class="btn btn-light " @click="addWatched()">Add Movie</button>
            <button class="btn btn-danger leave" @click.prevent="logout">Log out</button></p>
        <div class="card-deck">
            <div v-for="movie in watchedMovieList" class="card resize" >
                <img class="card-img-top" style="" v-bind:src="movie.image" >
                <div class="'card-body">
                    <p class="card-text">{{movie.name}}</p>
                    <div class="btn-group sticky-bottom" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-success"><i class="material-icons">
                            thumb_up
                        </i></button>
                        <button type="button" class="btn btn-danger"><i class="material-icons">
                            thumb_down
                        </i></button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="toWatchPopup">
            <div class="popup-background" @click="reset()"></div>
            <div class="popup">
                <p>Add a movie that you want to watch</p>
                <input class="form-control" placeholder="movie name">
                <button class="btn btn-primary">Submit</button>
            </div>
        </div>

        <p class="title">To Watch Movie <button class="btn btn-light" @click="addtoWatch()">Add Movie</button></p>
        <div class="card-deck ">
            <div v-for="movie in toWatchMovieList" class="card resize" >
                <img class="card-img-top" style="" v-bind:src="movie.image" >
                <div class="'card-body">
                    <p class="card-text">{{movie.name}}</p>
                </div>
            </div>
        </div>


        <p class="title">Recommended Movie</p>
        <div class="card-deck ">
            <div v-for="movie in recommendedList" class="card resize" >
                <img class="card-img-top" style="" v-bind:src="movie.image" >
                <div class="'card-body">
                    <p class="card-text">{{movie.name}}</p>
                </div>
            </div>
        </div>
        <footer class="blockquote-footer footer">Copyright 420 Server On Fire</footer>
    </div>
</template>
/* eslint-disable */
<script>
    import auth from '../auth'

    export default {
        name: "movies",
        data() {
            return {
                watchedPopup: false,
                toWatchPopup: false,
                token: '',
                watchedMovieList: [
                    {name: 'Safe', image: 'https://images-na.ssl-images-amazon.com/images/M/MV5BODliOWEzMTUtZDQ5ZS00ZTBmLTgzNzEtMGVkOTlhYWNkYjE2XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX182_CR0,0,182,268_AL_.jpg'},
                    {name: 'Desperado', image: 'https://images-na.ssl-images-amazon.com/images/M/MV5BYjA0NDMyYTgtMDgxOC00NGE0LWJkOTQtNDRjMjEzZmU0ZTQ3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX182_CR0,0,182,268_AL_.jpg'}
                ],
                toWatchMovieList: [
                    {name: 'Before the Rain ', image: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMTM3MzAwMzc1N15BMl5BanBnXkFtZTcwMjA4NjA3MQ@@._V1_UY268_CR5,0,182,268_AL_.jpg'},
                    {name: 'Before Sunrise ', image: 'https://images-na.ssl-images-amazon.com/images/M/MV5BZDdiZTAwYzAtMDI3Ni00OTRjLTkzN2UtMGE3MDMyZmU4NTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_UX182_CR0,0,182,268_AL_.jpg'},
                ],
                recommendedList: [
                    {name: 'The Cure', image: 'https://images-na.ssl-images-amazon.com/images/M/MV5BNTcyMDM2NjkzOF5BMl5BanBnXkFtZTcwNzg0MDcyMQ@@._V1_UY268_CR3,0,182,268_AL_.jpg'}
                ]
            }
        },
        created: function() {
            this.token = localStorage.getItem('user-token');
            console.log(this.token);
            let config = {
                headers: {'Authorization': "bearer " + this.token}
            };
            let bodyParameters = {
                key: "value"
            };
            this.axios.interceptors.request.use(
                (config) => {
                    let token = localStorage.getItem('user-token');

                    if (token) {
                        config.headers['Authorization'] = `Bearer ${ token }`;
                    }
                    // console.log(config);
                    return config;
                }, function (error) {
                    // Do something with request error
                    // console.log(error);
                    return Promise.reject(error);
                });
            this.axios.get('http://45.63.27.74:8080/recommendations',
            ).then((response) => {
                let movies = response.data.movies;
                console.log(response.data.movies);
                let recommendedList = [];
                this.recommendedList = [];
                this.toWatchMovieList = [];
                this.watchedMovieList = [];
                // let cnt = 0
                for (let movie of movies) {
                    let element = {};
                    // cnt++;
                    if (!movie.title || !movie.poster){
                        continue;
                    }
                    element.name = movie.title;
                    element.image = movie.poster;
                    recommendedList.push(element);
                }
                for (let i = 0; i < 5; i++) {
                    this.recommendedList.push(recommendedList[i]);
                }
                for (let i = 5; i < 10; i++) {
                    this.toWatchMovieList.push(recommendedList[i]);
                }
                for (let i = 10; i < 15; i++) {
                    this.watchedMovieList.push(recommendedList[i]);
                }
                console.log(this.recommendedList);
            });
        },
        methods: {
            logout: function (){
                localStorage.removeItem('user-token');
                this.$router.replace({ name: "login" });
            },
            addWatched: function () {
                this.watchedPopup = true;
                // this.watchedPopup = !this.watchedPopup;
            },
            addtoWatch: function() {
                this.toWatchPopup = true;
                // this.toWatchPopup = !this.toWatchPopup;
            },
            reset: function() {
                this.watchedPopup = false;
                this.toWatchPopup = false;
            }
        }
    }
</script>

<style scoped>
    .title{
        text-align: left;
        font-weight: bold;
        font-size: 20px;
        margin-top: 30px;
    }
.resize {
    max-width: 200px;
}
.sticky-bottom {

}
    .leave {
        position: absolute;
        right: 60px;
    }
    .footer {
        margin-top: 30px;
        margin-bottom: 20px;
    }
    .popup-background {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #333;
        filter: alpha(opacity=80);
        opacity: 0.8;
        z-index: 100;
    }
    .popup {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: #FFFFFF;
        width: 90%;
        max-width: 700px;
        padding: 30px;
        border: 2px solid #000;
        font-size: 1.21em;
        line-height: 1.6em;
        z-index: 101;
    }
</style>