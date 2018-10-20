<template>
    <div class="container">
        <div v-if="watchedPopup">
            <div class="popup-background" @click="reset()"></div>
            <div class="popup">
                <p>Add a movie that you have watched</p>
                <div class="form-row">
                    <div class="col-9">
                    <input class="form-control" placeholder="movie name" v-model="newMovie" @keyup="search" @keyup.enter="submitWatched">
                    </div>
                    <div class="col-1">
                    <button class="btn btn-primary" @click="submitWatched">submit</button>
                    </div>
                </div>
                <div class="prompt" v-if="showSuggestion">
                    <p class="choice" v-for="movie in watchedSuggestion" @click="select(movie)">{{movie.title}} ({{movie.year}})</p>
                </div>
                <div class="selected scrollbar-cyan thin" v-if="showSelected">
                    <div class="selectedTitle">
                        <h5>{{selectedMovie.title}}</h5>
                        <button type="button" class="btn btn-success" :class="{ disabled: LikeorNot }" @click="clickLike()"><i class="material-icons">
                            thumb_up
                        </i></button>
                        <button type="button" class="btn btn-danger" :class="{ disabled: !LikeorNot }" @click="clickDislike()"><i class="material-icons">
                            thumb_down
                        </i></button>
                        <div class="rating">{{selectedMovie.imdbRating}}</div>
                    </div>
                    <p>{{selectedMovie.plot}}</p>
                    <p>Actors: <span v-for="actor in selectedMovie.actors">{{actor}}  </span></p>
                    <img :src="selectedMovie.poster">
                </div>
                <p v-if="showWarning" class="error">{{warningMsg}}</p>
                <!--<button class="btn btn-primary">Submit</button>-->
            </div>
        </div>
        <p class="title">Watched Movie <button class="btn btn-light" @click="addWatched()">Add Movie</button>
            <button class="btn btn-danger leave" @click.prevent="logout">Log out</button></p>
        <div class="card-deck">
            <div v-for="(movie, index) in watchedMovieList" class="card resize card-parent" @mouseover="showIcon(movie)" @mouseleave="hideIcon(movie)">
                <button class="btn btn-danger floating" v-if="movie.icon" @click="deleteWatchedMovie(movie, index)"><i class="material-icons">
                    clear
                </i></button>
                <img class="card-img-top" style="" v-bind:src="movie.poster" >
                <div class="'card-body">
                    <p class="card-text">{{movie.title}}</p>
                    <div class="btn-group sticky-bottom" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-success" :class="{ disabled: !movie.like }" @click="like(movie)"><i class="material-icons">
                            thumb_up
                        </i></button>
                        <button type="button" class="btn btn-danger" :class="{ disabled: movie.like }" @click="dislike(movie)"><i class="material-icons">
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
                <div class="form-row">
                    <div class="col-9">
                    <input class="form-control" placeholder="movie name" v-model="newMovie" @keyup="search" @keyup.enter="submitToWatch">
                    </div>
                    <div class="col-1">
                        <button class="btn btn-primary" @click="submitToWatch">submit</button>
                    </div>
                </div>
                <div class="prompt" v-if="showSuggestion">
                    <p class="choice" v-for="movie in watchedSuggestion" @click="select(movie)">{{movie.title}} ({{movie.year}})</p>
                </div>
                <div class="selected scrollbar-cyan thin" v-if="showSelected">
                    <div class="selectedTitle">
                        <h5>{{selectedMovie.title}}</h5>
                        <div class="rating">{{selectedMovie.imdbRating}}</div>
                    </div>
                    <p>{{selectedMovie.plot}}</p>
                    <p>Actors: <span v-for="actor in selectedMovie.actors">{{actor}}  </span></p>
                    <img :src="selectedMovie.poster">
                </div>
                <p v-if="showWarning" class="error">{{warningMsg}}</p>
                <!--<button class="btn btn-primary">Submit</button>-->
            </div>
        </div>

        <p class="title">To Watch Movie <button class="btn btn-light" @click="addtoWatch()">Add Movie</button></p>
        <div class="card-deck ">
            <div v-for="(movie, index) in toWatchMovieList" class="card resize card-parent" @mouseover="showIcon(movie)" @mouseleave="hideIcon(movie)">
                <button class="btn btn-danger floating" v-if="movie.icon" @click="delete2WatchMovie(movie, index)"><i class="material-icons">
                    clear
                </i></button>
                <img class="card-img-top" style="" v-bind:src="movie.poster" >
                <div class="'card-body">
                    <p class="card-text">{{movie.title}}</p>
                </div>
            </div>
        </div>

        <div v-if="recommendPopup">
            <div class="popup-background" @click="reset()"></div>
            <div class="popup scrollbar-cyan thin">
                <p>{{recommendMovie.title}}</p>
                <p>{{recommendMovie.plot}}</p>
                <img :src="recommendMovie.poster">
            </div>
        </div>

        <p class="title">Recommended Movie</p>
        <div class="card-deck ">
            <div v-for="movie in recommendedList" class="card resize cover-parent" @click="showDescrip(movie)" >
                <!--<p v-if="movie.descrip" class="cover">{{movie.plot}}</p>-->
                <img class="card-img-top" style="" v-bind:src="movie.poster" >
                <div class="'card-body">
                    <p class="card-text">{{movie.title}}</p>
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
                recommendPopup: false,
                recommendMovie: {},
                token: '',
                user_id: '',
                // movie_id: '',
                movieDetail: '',
                newMovie: '',
                movie_to_add: '',
                LikeorNot: null,
                showSuggestion: false,
                showWarning: false,
                warningMsg: false,
                showSelected: false,
                watchedMovieList: [
                    // {name: 'Safe', image: 'https://images-na.ssl-images-amazon.com/images/M/MV5BODliOWEzMTUtZDQ5ZS00ZTBmLTgzNzEtMGVkOTlhYWNkYjE2XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX182_CR0,0,182,268_AL_.jpg'},
                    // {name: 'Desperado', image: 'https://images-na.ssl-images-amazon.com/images/M/MV5BYjA0NDMyYTgtMDgxOC00NGE0LWJkOTQtNDRjMjEzZmU0ZTQ3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX182_CR0,0,182,268_AL_.jpg'}
                ],
                watchedSuggestion: [
                    // {title: 'Titanic', year: '2012'},
                    // {title: 'King Kong', year: '1997'}
                ],
                toWatchMovieList: [
                    // {name: 'Before the Rain ', image: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMTM3MzAwMzc1N15BMl5BanBnXkFtZTcwMjA4NjA3MQ@@._V1_UY268_CR5,0,182,268_AL_.jpg'},
                    // {name: 'Before Sunrise ', image: 'https://images-na.ssl-images-amazon.com/images/M/MV5BZDdiZTAwYzAtMDI3Ni00OTRjLTkzN2UtMGE3MDMyZmU4NTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_UX182_CR0,0,182,268_AL_.jpg'},
                ],
                recommendedList: [
                    // {name: 'The Cure', image: 'https://images-na.ssl-images-amazon.com/images/M/MV5BNTcyMDM2NjkzOF5BMl5BanBnXkFtZTcwNzg0MDcyMQ@@._V1_UY268_CR3,0,182,268_AL_.jpg'}
                ],
                selectedMovie: {}
            }
        },
        created: function() {
            this.token = localStorage.getItem('user-token');
            this.user_id = localStorage.getItem('user-id');
            // console.log(this.token);
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
            this.axios.get('http://45.63.27.74:8080/interactions')
                .then((response) => {
                    console.log(response.data);
                    for (let record of response.data) {
                        let element = {};
                        if (record.movie.poster) {
                            element.interact_id = record.id;
                            element.movie_id = record.movie._id;
                            element.title = record.movie.title;
                            element.poster = record.movie.poster;
                            element.icon = false;
                            element.like = record.hasLiked;
                        }
                        // console.log(element);
                        if (record.hasWatched && record.movie.poster) {
                            // console.log(element);
                            this.watchedMovieList.push(element);
                        }
                        if (record.wantToWatch && record.movie.poster) {
                            // console.log(record);
                            this.toWatchMovieList.push(element)
                        }
                    }
                });
            // console.log(this.watchedMovieList)
            this.axios.get('http://45.63.27.74:8080/recommendations?limit=20'
            ).then((response) => {
                let movies = response.data.movies;
                // console.log(response.data.movies);
                // let recommendedList = [];
                this.recommendedList = [];
                // this.toWatchMovieList = [];
                // this.watchedMovieList = [];
                // let cnt = 0
                for (let movie of movies) {
                    let element = {};
                    // cnt++;
                    if (!movie.title || !movie.poster){
                        continue;
                    }
                    element.title = movie.title;
                    element.poster = movie.poster;
                    element.plot = movie.plot;
                    element.genres = movie.genres;
                    element.descrip = false;
                    // element.icon = false;
                    this.recommendedList.push(element);
                }
            });
        },
        methods: {
            logout: function (){
                localStorage.removeItem('user-token');
                this.$router.replace({ name: "login" });
            },
            addWatched: function () {
                this.watchedSuggestion = [];
                this.newMovie = '';
                this.movie_to_add = '';
                this.watchedPopup = true;
                // this.watchedPopup = !this.watchedPopup;
            },
            addtoWatch: function() {
                this.watchedSuggestion = [];
                this.newMovie = '';
                this.movie_to_add = '';
                this.toWatchPopup = true;
                // this.showSuggestion = false;
                // this.showWarning = false;
                // this.toWatchPopup = !this.toWatchPopup;
            },
            reset: function() {
                this.watchedPopup = false;
                this.toWatchPopup = false;
                this.showSuggestion = false;
                this.showWarning = false;
                this.showSelected = false;
                this.LikeorNot = null;
                this.recommendPopup = false;
            },
            showDescrip: function(movie) {
                // console.log(movieDetail.plot)
                // console.log('hover');
                // movie.descrip = true;
                this.recommendPopup = true;
                this.recommendMovie.title = movie.title;
                this.recommendMovie.plot = movie.plot;
                this.recommendMovie.poster = movie.poster;
            },
            // hideDescrip: function(movie) {
            //     movie.descrip = false;
            // },
            showIcon: function(movie) {
                // console.log('over');
                movie.icon = true;
            },
            hideIcon: function(movie) {
                movie.icon = false;
            },
            deleteWatchedMovie: function(movie, index) {
                this.watchedMovieList.splice(index, 1);
                this.axios.delete(`http://45.63.27.74:8080/interactions/${movie.interact_id}`)
                    .then(res=> {
                        this.axios.get('http://45.63.27.74:8080/recommendations?limit=20'
                        ).then((response) => {
                            let movies = response.data.movies;
                            this.recommendedList = [];
                            for (let movie of movies) {
                                let element = {};
                                // cnt++;
                                if (!movie.title || !movie.poster){
                                    continue;
                                }
                                element.title = movie.title;
                                element.poster = movie.poster;
                                element.plot = movie.plot;
                                element.genres = movie.genres;
                                element.descrip = false;
                                // element.icon = false;
                                this.recommendedList.push(element);
                            }
                        });
                    });
            },
            delete2WatchMovie: function(movie, index) {
                console.log(movie);
                this.toWatchMovieList.splice(index, 1);
                this.axios.delete(`http://45.63.27.74:8080/interactions/${movie.interact_id}`)
                    .then(res=> {
                        this.axios.get('http://45.63.27.74:8080/recommendations?limit=20'
                        ).then((response) => {
                            let movies = response.data.movies;
                            this.recommendedList = [];
                            for (let movie of movies) {
                                let element = {};
                                // cnt++;
                                if (!movie.title || !movie.poster){
                                    continue;
                                }
                                element.title = movie.title;
                                element.poster = movie.poster;
                                element.plot = movie.plot;
                                element.genres = movie.genres;
                                element.descrip = false;
                                // element.icon = false;
                                this.recommendedList.push(element);
                            }
                        });
                    });
            },
            search: function(newMovie) {
                // console.log(this.newMovie);
                this.showSuggestion = true;
                this.showSelected = false;
                this.showWarning = false;
                this.axios.get(`http://45.63.27.74:8080/movies?q=${this.newMovie}&fields=title,year,plot,poster,actors,directors,imdbRating,languages&limit=5`)
                    .then(res => {
                        // console.log(res);
                        this.watchedSuggestion = [];
                        if (!res.data.length) {
                            this.warningMsg = 'No movie has been found';
                            this.showWarning = true;
                        }
                        // console.log(res.data[0]);
                        for (let movie of res.data) {
                            // this.watchedSuggestion.push({id: movie.id, title: movie.title, year: movie.year});
                            this.watchedSuggestion.push(movie);
                        }
                    })
            },
            submitWatched: function(newMovie) {
                // console.log('submit', this.newMovie);
                console.log(this.LikeorNot);
                if (!this.movie_to_add){
                    this.showWarning = true;
                    this.warningMsg = 'Must pick a movie';
                }
                if (this.LikeorNot === null) {
                    this.showWarning = true;
                    this.warningMsg = 'Please choose like or not';
                    return;
                }
                this.axios.post('http://45.63.27.74:8080/interactions', {
                    user: this.user_id,
                    // movie: newMovie.movie_id,
                    // hasLiked: true,
                    movie: this.movie_to_add,
                    hasLiked: this.LikeorNot,
                    hasWatched: true
                }).then(res => {
                    console.log(res);
                    if (res.request.status === 200) {
                        this.showWarning = true;
                        this.warningMsg = 'This movie has been added';
                    } else {
                        let element = {};
                        // element.interact_id = record.id;
                        element.interact_id = res.data._id;
                        element.movie_id = res.data.movie._id;
                        element.title = res.data.movie.title;
                        element.poster = res.data.movie.poster;
                        this.watchedMovieList.push(element);
                    }

                    this.axios.get('http://45.63.27.74:8080/recommendations?limit=20'
                    ).then((response) => {
                        let movies = response.data.movies;
                        this.recommendedList = [];
                        for (let movie of movies) {
                            let element = {};
                            // cnt++;
                            if (!movie.title || !movie.poster){
                                continue;
                            }
                            element.title = movie.title;
                            element.poster = movie.poster;
                            element.plot = movie.plot;
                            element.genres = movie.genres;
                            element.descrip = false;
                            // element.icon = false;
                            this.recommendedList.push(element);
                        }
                    });
                });
                this.reset();
            },
            submitToWatch: function(newMovie) {
                // console.log('enter', this.newMovie);
                this.showSuggestion = false;
                if (!this.movie_to_add){
                    this.showWarning = true;
                    this.warningMsg = 'Must pick a movie';
                }
                console.log(`user: ${this.user_id}, movie: ${this.movie_to_add}`);
                this.axios.post('http://45.63.27.74:8080/interactions', {
                    user: this.user_id,
                    movie: this.movie_to_add,
                    wantToWatch: true
                })
                    .then(res => {
                        console.log(res)
                        if (res.request.status === 200) {
                            this.showWarning = true;
                            this.warningMsg = 'This movie has been added';
                        } else {
                            let element = {};
                            element.interact_id = res.data._id;
                            element.movie_id = res.data.movie._id;
                            element.title = res.data.movie.title;
                            element.poster = res.data.movie.poster;
                            this.toWatchMovieList.push(element);
                        }
                        this.axios.get('http://45.63.27.74:8080/recommendations?limit=20'
                        ).then((response) => {
                            let movies = response.data.movies;
                            this.recommendedList = [];
                            for (let movie of movies) {
                                let element = {};
                                // cnt++;
                                if (!movie.title || !movie.poster){
                                    continue;
                                }
                                element.title = movie.title;
                                element.poster = movie.poster;
                                element.plot = movie.plot;
                                element.genres = movie.genres;
                                element.descrip = false;
                                // element.icon = false;
                                this.recommendedList.push(element);
                            }
                        });
                });
                this.reset();
            },
            select: function (newMovie) {
                this.newMovie = newMovie.title;
                this.movie_to_add = newMovie.id;
                this.showSuggestion = false;
                this.selectedMovie = newMovie;
                this.showSelected = true;
                this.LikeorNot = null;
                // console.log(newMovie);
            },
            like: function(movie) {
                // console.log('like', movie.title);
                movie.like = true;
                this.axios.put(`http://45.63.27.74:8080/interactions/${movie.interact_id}`, {
                    hasLiked: true
                })
                    .then(res=> {
                        this.axios.get('http://45.63.27.74:8080/recommendations?limit=20'
                        ).then((response) => {
                            let movies = response.data.movies;
                            this.recommendedList = [];
                            for (let movie of movies) {
                                let element = {};
                                // cnt++;
                                if (!movie.title || !movie.poster){
                                    continue;
                                }
                                element.title = movie.title;
                                element.poster = movie.poster;
                                element.plot = movie.plot;
                                element.genres = movie.genres;
                                element.descrip = false;
                                // element.icon = false;
                                this.recommendedList.push(element);
                            }
                        });
                    });
            },
            dislike: function(movie) {
                // console.log('dislike', movie.title);
                movie.like = false;
                this.axios.put(`http://45.63.27.74:8080/interactions/${movie.interact_id}`, {
                    hasLiked: false
                })
                    .then(res=> {
                    this.axios.get('http://45.63.27.74:8080/recommendations?limit=20'
                    ).then((response) => {
                        let movies = response.data.movies;
                        this.recommendedList = [];
                        for (let movie of movies) {
                            let element = {};
                            // cnt++;
                            if (!movie.title || !movie.poster){
                                continue;
                            }
                            element.title = movie.title;
                            element.poster = movie.poster;
                            element.plot = movie.plot;
                            element.genres = movie.genres;
                            element.descrip = false;
                            // element.icon = false;
                            this.recommendedList.push(element);
                        }
                    });
                });
            },
            clickLike: function() {
                this.LikeorNot = true;
                // console.log(this.LikeorNot);
            },
            clickDislike: function() {
                this.LikeorNot = false;
                // console.log(this.LikeorNot);
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
.cover-parent {
    position: relative;
}
.choice {
    cursor: pointer;
}
.card-parent {
    position: relative;
}
.floating {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
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

        overflow-y: scroll;
        max-height: 500px;
    }

    .scrollbar-cyan::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
        background-color: #F5F5F5;
        border-radius: 10px;
    }

    .scrollbar-cyan::-webkit-scrollbar {
        width: 12px;
        background-color: #F5F5F5;
    }

    .scrollbar-cyan::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
        background-color: #00bcd4;
    }
    .thin::-webkit-scrollbar {
        width: 6px;
    }

    .error {
        margin-top: 10px;
        color: red;
    }
    .selected {
        font-size: 12px;
    }

    .card-deck {
        display: flex;
        /* flex-direction: row; */
        flex-wrap: nowrap;
        min-width: 100%;
        min-height: 350px;
        overflow-x: auto;
        /* overflow-y: hidden; */
    }
    .card {
        display: inline-block;
        flex-grow: 0;
        margin: 5px;
        min-width: 200px;
        /*max-height: 400px;*/
        max-width: 200px;
    }
    .card::-webkit-scrollbar {
        display: none;
    }
</style>