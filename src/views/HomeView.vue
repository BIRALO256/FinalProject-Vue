<template>
  <div class="home">
    <h1>hello from home</h1>
    <br>

    <div  v-if="error">{{error}}</div>

    <div v-if="posts.length">
      <PostList :jovic="posts" />
    </div>
    <div v-else >Loading.......</div>
  </div>
</template>
// on line 6... we try to display an error if we find one when trying to fetch the data
// on line 8 .length means if it's not empty diplay the data
<script>
// @ is an alias to /src

import PostList from '../components/PostList.vue';
import getposts from '../composable/getpost.js'

export default {
  name: 'HomeView',

  components: {PostList},

  setup(){
    
  const {posts, error,load} =getposts() // we acces the data that is return from the getpost composable to be used here
  load() // then use what we got like now we are using load function 

    return{posts,error}
  }
}
</script>
