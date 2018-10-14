<template>
    <div class="container">
        <p class="title">Watched Movie <button class="btn btn-light ">Add Movie</button></p>
        <div class="card-deck ">
            <div v-for="movie in watchedMovieList" class="card resize" :key="movie">
                <img class="card-img-top" style="" v-bind:src="movie.image" >
                <div class="'card-body">
                    <p class="card-text">{{movie.name}}</p>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-success">like</button>
                        <button type="button" class="btn btn-danger">dislike</button>
                    </div>
                </div>
            </div>
        </div>


        <p class="title">To Watch Movie <button class="btn btn-light ">Add Movie</button></p>
        <div class="card-deck ">
            <div v-for="movie in toWatchMovieList" class="card resize" :key="movie">
                <img class="card-img-top" style="" v-bind:src="movie.image" >
                <div class="'card-body">
                    <p class="card-text">{{movie.name}}</p>
                </div>
            </div>
        </div>


        <p class="title">Recommended Movie</p>
        <div class="card-deck ">
            <div v-for="movie in recommendedList" class="card resize" :key="movie">
                <img class="card-img-top" style="" v-bind:src="movie.image" >
                <div class="'card-body">
                    <p class="card-text">{{movie.name}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
/* eslint-disable */
<script>
    export default {
        name: "movies",
        data() {
            return {
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
    .add {
        text-align: right;
    }
</style>