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
                <img class="card-img-top" @click="showDescrip(movie)" v-bind:src="movie.poster" >
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
                    <p><b>Actors: </b><span v-for="actor in selectedMovie.actors">{{actor}}  </span></p>
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
                <img class="card-img-top" @click="showDescrip(movie)" v-bind:src="movie.poster" >
                <div class="'card-body">
                    <p class="card-text">{{movie.title}}</p>
                </div>
            </div>
        </div>

        <div v-if="recommendPopup">
            <div class="popup-background" @click="reset()"></div>
            <div class="popup scrollbar-cyan thin">
                <p>{{recommendMovie.title}} ({{recommendMovie.year}})</p>
                <p>{{recommendMovie.runtime}} <i class="material-icons">
                    stars
                </i>{{recommendMovie.imdbRating}}
                    <button class="btn btn-primary last-btn" @click="fromRecom2Watch(recommendMovie)" v-if="showFavBtn">Add to Watch</button>
                </p>

                <img :src="recommendMovie.poster">
                <div class="detailed_context">
                <p class="detailed_plot">{{recommendMovie.plot}}</p>
                <p v-if="recommendMovie.genres"><b>Genres: </b>{{recommendMovie.genres.join(', ')}}</p>
                <p v-if="recommendMovie.directors"><b>Directors: </b>{{recommendMovie.directors.join(', ')}}</p>
                <p v-if="recommendMovie.actors"><b>Actors: </b>{{recommendMovie.actors.join(', ')}}</p>
                <p v-if="recommendMovie.languages"><b>Languages: </b>{{recommendMovie.languages.join(', ')}}</p>
                </div>

            </div>
        </div>

        <p class="title">Recommended Movie</p>
        <div class="card-deck ">
            <div v-for="movie in recommendedList" class="card resize cover-parent" @click="showRecommend(movie)" >
                <!--<p v-if="movie.descrip" class="cover">{{movie.plot}}</p>-->
                <img class="card-img-top" v-bind:src="movie.poster" >
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
    // import auth from '../auth'

    export default {
        name: "movies",
        data() {
            return {
                API: 'http://45.63.27.74:8080',         // change API address if you have to
                watchedPopup: false,
                toWatchPopup: false,
                recommendPopup: false,
                recommendMovie: {},
                token: '',
                user_id: '',
                movieDetail: '',
                newMovie: '',
                movie_to_add: '',
                LikeorNot: null,
                showSuggestion: false,
                showWarning: false,
                warningMsg: false,
                showSelected: false,
                showFavBtn : false,
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
            // console.log(this.API + '/interactions');
            this.token = localStorage.getItem('user-token');
            this.user_id = localStorage.getItem('user-id');
            // console.log(this.token);
            // let config = {
            //     headers: {'Authorization': "bearer " + this.token}
            // };
            // let bodyParameters = {
            //     key: "value"
            // };
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
            // this.axios.get('http://45.63.27.74:8080/interactions')
            this.axios.get(this.API + '/interactions?sort=-updatedAt&limit=100')
                .then((response) => {
                    // console.log(response.data);
                    for (let record of response.data) {
                        let element = {};
                        if (!record.movie) {
                            continue;
                        }
                        if (record.hasWatched && record.wantToWatch) {
                            continue;
                        }
                        if (record.movie && record.movie.poster) {
                            element.interact_id = record.id;
                            element.movie_id = record.movie._id;
                            element.title = record.movie.title;
                            element.plot = record.movie.plot;
                            element.poster = record.movie.poster;
                            element.genres = record.movie.genres;
                            element.actors = record.movie.actors;
                            element.directors = record.movie.directors;
                            element.languages = record.movie.languages;
                            element.year = record.movie.year;
                            element.imdbRating = record.movie.imdbRating;
                            element.runtime = record.movie.runtime;

                            element.icon = false;
                            element.like = record.hasLiked;
                        }
                        // console.log(element);
                        if (record.hasWatched && record.movie && record.movie.poster) {
                            // console.log(element);
                            this.watchedMovieList.push(element);
                        }
                        if (record.wantToWatch && record.movie && record.movie.poster) {
                            // console.log(record);
                            this.toWatchMovieList.push(element)
                        }
                    }
                });
            // console.log(this.watchedMovieList)
            // this.axios.get('http://45.63.27.74:8080/recommendations?limit=20'
            this.axios.get(this.API + '/recommendations?limit=20'
            ).then((response) => {
                let movies = response.data.movies;
                // let recommendedList = [];
                this.recommendedList = [];
                // this.toWatchMovieList = [];
                // this.watchedMovieList = [];
                // let cnt = 0
                for (let movie of movies) {
                    let element = {};
                    if (!movie) {
                        continue;
                    }
                    // cnt++;
                    if (!movie.title || !movie.poster){
                        continue;
                    }
                    element.id = movie._id;
                    element.title = movie.title;
                    element.poster = movie.poster;
                    element.plot = movie.plot;
                    element.genres = movie.genres;
                    element.actors = movie.actors;
                    element.directors = movie.directors;
                    element.languages = movie.languages;
                    element.year = movie.year;
                    element.imdbRating = movie.imdbRating;
                    element.runtime = movie.runtime;

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
                this.showFavBtn = false;
            },
            showDescrip: function(movie) {
                // console.log(movieDetail.plot)
                // console.log('hover');
                // movie.descrip = true;
                this.recommendPopup = true;
                this.recommendMovie = movie;
                // this.recommendMovie.title = movie.title;
                // this.recommendMovie.plot = movie.plot;
                // this.recommendMovie.poster = movie.poster;
            },
            showRecommend: function(movie) {
                this.showDescrip(movie);
                this.showFavBtn = true;
            },
            fromRecom2Watch: function(movie) {
                // console.log(movie);
                this.movie_to_add = movie.id;
                this.submitToWatch();
                this.reset();
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
                // this.axios.delete(`http://45.63.27.74:8080/interactions/${movie.interact_id}`)
                this.axios.delete(`${this.API}/interactions/${movie.interact_id}`)
                    .then(() => {
                        // this.axios.get('http://45.63.27.74:8080/recommendations?limit=20'
                        this.axios.get(this.API + '/recommendations?limit=20'
                        ).then((response) => {
                            let movies = response.data.movies;
                            // let recommendedList = [];
                            this.recommendedList = [];
                            // this.toWatchMovieList = [];
                            // this.watchedMovieList = [];
                            // let cnt = 0
                            for (let movie of movies) {
                                let element = {};
                                if (!movie) {
                                    continue;
                                }
                                // cnt++;
                                if (!movie.title || !movie.poster){
                                    continue;
                                }
                                element.id = movie._id;
                                element.title = movie.title;
                                element.poster = movie.poster;
                                element.plot = movie.plot;
                                element.genres = movie.genres;
                                element.actors = movie.actors;
                                element.directors = movie.directors;
                                element.languages = movie.languages;
                                element.year = movie.year;
                                element.imdbRating = movie.imdbRating;
                                element.runtime = movie.runtime;

                                element.descrip = false;
                                // element.icon = false;
                                this.recommendedList.push(element);
                            }
                        });
                    });
            },
            delete2WatchMovie: function(movie, index) {
                // console.log(movie);
                this.toWatchMovieList.splice(index, 1);
                // this.axios.delete(`http://45.63.27.74:8080/interactions/${movie.interact_id}`)
                this.axios.delete(`${this.API}/interactions/${movie.interact_id}`)
                    .then(() => {
                        // this.axios.get('http://45.63.27.74:8080/recommendations?limit=20'
                        this.axios.get(this.API + '/recommendations?limit=20'
                        ).then((response) => {
                            let movies = response.data.movies;
                            // let recommendedList = [];
                            this.recommendedList = [];
                            // this.toWatchMovieList = [];
                            // this.watchedMovieList = [];
                            // let cnt = 0
                            for (let movie of movies) {
                                let element = {};
                                if (!movie) {
                                    continue;
                                }
                                // cnt++;
                                if (!movie.title || !movie.poster){
                                    continue;
                                }
                                element.id = movie._id;
                                element.title = movie.title;
                                element.poster = movie.poster;
                                element.plot = movie.plot;
                                element.genres = movie.genres;
                                element.actors = movie.actors;
                                element.directors = movie.directors;
                                element.languages = movie.languages;
                                element.year = movie.year;
                                element.imdbRating = movie.imdbRating;
                                element.runtime = movie.runtime;

                                element.descrip = false;
                                // element.icon = false;
                                this.recommendedList.push(element);
                            }
                        });
                    });
            },
            search: function() {
                // console.log(this.newMovie);
                this.showSuggestion = true;
                this.showSelected = false;
                this.showWarning = false;
                // this.axios.get(`http://45.63.27.74:8080/movies?q=${this.newMovie}&fields=title,year,plot,poster,actors,directors,imdbRating,languages&limit=5`)
                this.axios.get(`${this.API}/movies?q=${this.newMovie}&fields=title,year,plot,poster,actors,directors,imdbRating,languages&limit=5`)
                    .then(res => {
                        // console.log(res);
                        this.watchedSuggestion = [];
                        if (!res.data.length) {
                            this.warningMsg = 'No movie has been found';
                            this.showWarning = true;
                        }
                        // console.log(res.data[0]);
                        for (let movie of res.data) {
                            if (!movie.poster) {
                                continue;
                            }
                            // this.watchedSuggestion.push({id: movie.id, title: movie.title, year: movie.year});
                            this.watchedSuggestion.push(movie);
                        }
                    })
            },
            submitWatched: function() {
                // console.log('submit', this.newMovie);
                // console.log(this.LikeorNot);
                if (!this.movie_to_add){
                    this.showWarning = true;
                    this.warningMsg = 'Must pick a movie';
                }
                if (this.LikeorNot === null) {
                    this.showWarning = true;
                    this.warningMsg = 'Please choose like or not';
                    return;
                }
                // this.axios.post('http://45.63.27.74:8080/interactions', {
                this.axios.post(this.API + '/interactions', {
                    user: this.user_id,
                    // movie: newMovie.movie_id,
                    // hasLiked: true,
                    movie: this.movie_to_add,
                    hasLiked: this.LikeorNot,
                    hasWatched: true
                }).then(res => {
                    // console.log(res);
                    if (res.request.status === 200) {
                        this.showWarning = true;
                        this.warningMsg = 'This movie has been added';
                    } else {
                        let element = {};
                        // element.interact_id = record.id;
                        element.interact_id = res.data._id;
                        element.movie_id = res.data.movie._id;
                        element.plot = res.data.movie.plot;
                        element.title = res.data.movie.title;
                        element.poster = res.data.movie.poster;
                        element.genres = res.data.movie.genres;
                        element.actors = res.data.movie.actors;
                        element.directors = res.data.movie.directors;
                        element.languages = res.data.movie.languages;
                        element.imdbRating = res.data.movie.imdbRating;
                        element.runtime = res.data.movie.runtime;

                        this.watchedMovieList.unshift(element);
                    }

                    this.axios.get(this.API + '/recommendations?limit=20'
                    // this.axios.get('http://45.63.27.74:8080/recommendations?limit=20'
                    ).then((response) => {
                        console.log(response);
                        let movies = response.data.movies;
                        this.recommendedList = [];
                        for (let movie of movies) {
                            let element = {};
                            if (!movie) {
                                continue;
                            }
                            // cnt++;
                            if (!movie.title || !movie.poster){
                                continue;
                            }
                            element.id = movie._id;
                            element.title = movie.title;
                            element.poster = movie.poster;
                            element.plot = movie.plot;
                            element.genres = movie.genres;
                            element.actors = movie.actors;
                            element.directors = movie.directors;
                            element.languages = movie.languages;
                            element.year = movie.year;
                            element.imdbRating = movie.imdbRating;
                            element.runtime = movie.runtime;
                            element.descrip = false;
                            // element.icon = false;
                            this.recommendedList.push(element);
                        }
                    });
                });
                this.reset();
            },
            submitToWatch: function() {
                // console.log('enter', this.newMovie);
                this.showSuggestion = false;
                if (!this.movie_to_add){
                    this.showWarning = true;
                    this.warningMsg = 'Must pick a movie';
                }
                // console.log(`user: ${this.user_id}, movie: ${this.movie_to_add}`);
                // this.axios.post('http://45.63.27.74:8080/interactions', {
                this.axios.post(this.API + '/interactions', {
                    user: this.user_id,
                    movie: this.movie_to_add,
                    wantToWatch: true
                })
                    .then(res => {
                        // console.log(res);
                        if (res.request.status === 200) {
                            this.showWarning = true;
                            this.warningMsg = 'This movie has been added';
                        } else {
                            let element = {};
                            element.interact_id = res.data._id;
                            element.movie_id = res.data.movie._id;
                            element.plot = res.data.movie.plot;
                            element.title = res.data.movie.title;
                            element.poster = res.data.movie.poster;
                            element.genres = res.data.movie.genres;
                            element.actors = res.data.movie.actors;
                            element.directors = res.data.movie.directors;
                            element.languages = res.data.movie.languages;
                            element.imdbRating = res.data.movie.imdbRating;
                            element.runtime = res.data.movie.runtime;
                            this.toWatchMovieList.unshift(element);
                        }
                        // this.axios.get('http://45.63.27.74:8080/recommendations?limit=20'
                        this.axios.get(this.API + '/recommendations?limit=20'
                        ).then((response) => {
                            let movies = response.data.movies;
                            this.recommendedList = [];
                            for (let movie of movies) {
                                let element = {};
                                if(!movie) {
                                    continue;
                                }
                                if (!movie.title || !movie.poster){
                                    continue;
                                }
                                element.id = movie._id;
                                element.title = movie.title;
                                element.poster = movie.poster;
                                element.plot = movie.plot;
                                element.genres = movie.genres;
                                element.actors = movie.actors;
                                element.directors = movie.directors;
                                element.languages = movie.languages;
                                element.year = movie.year;
                                element.imdbRating = movie.imdbRating;
                                element.runtime = movie.runtime;
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
                // this.axios.put(`http://45.63.27.74:8080/interactions/${movie.interact_id}`, {
                this.axios.put(`${this.API}/interactions/${movie.interact_id}`, {
                    hasLiked: true
                })
                    .then(() => {
                        // this.axios.get('http://45.63.27.74:8080/recommendations?limit=20'
                        this.axios.get(this.API + '/recommendations?limit=20'
                        ).then((response) => {
                            let movies = response.data.movies;
                            this.recommendedList = [];
                            for (let movie of movies) {
                                let element = {};
                                if(!movie) {
                                    continue;
                                }
                                if (!movie.title || !movie.poster){
                                    continue;
                                }
                                element.id = movie._id;
                                element.title = movie.title;
                                element.poster = movie.poster;
                                element.plot = movie.plot;
                                element.genres = movie.genres;
                                element.actors = movie.actors;
                                element.directors = movie.directors;
                                element.languages = movie.languages;
                                element.year = movie.year;
                                element.imdbRating = movie.imdbRating;
                                element.runtime = movie.runtime;
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
                // this.axios.put(`http://45.63.27.74:8080/interactions/${movie.interact_id}`, {
                this.axios.put(`${this.API}/interactions/${movie.interact_id}`, {
                    hasLiked: false
                })
                    .then(() => {
                    // this.axios.get('http://45.63.27.74:8080/recommendations?limit=20'
                        this.axios.get(this.API + '/recommendations?limit=20'
                        ).then((response) => {
                        let movies = response.data.movies;
                        this.recommendedList = [];
                        for (let movie of movies) {
                            let element = {};
                            if(!movie) {
                                continue;
                            }
                            if (!movie.title || !movie.poster){
                                continue;
                            }
                            element.id = movie._id;
                            element.title = movie.title;
                            element.poster = movie.poster;
                            element.plot = movie.plot;
                            element.genres = movie.genres;
                            element.actors = movie.actors;
                            element.directors = movie.directors;
                            element.languages = movie.languages;
                            element.year = movie.year;
                            element.imdbRating = movie.imdbRating;
                            element.runtime = movie.runtime;
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
        max-height: 600px;
    }
    .last-btn {
        float: right;
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
    .detailed_context {
        text-align: left;
    }

    .card-deck {
        display: flex;
        flex-wrap: nowrap;
        min-width: 100%;
        min-height: 350px;
        /*overflow-x: auto;*/
        overflow-x: scroll;

    }
    .card {
        display: inline-block;
        flex-grow: 0;
        margin: 5px;
        min-width: 200px;
        max-width: 200px;
    }
    /*.card::-webkit-scrollbar {*/
        /*display: none;*/
    /*}*/
</style>