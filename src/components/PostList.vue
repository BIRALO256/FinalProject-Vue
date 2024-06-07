<template>
    <div class="post-list" > post here</div>
    <div v-for="post in jovic" :key="post.id" >
        <h3>{{ post.title }}</h3>
        <SinglePost :posts ='post' />
    </div>
</template>

<script>
import SinglePost from './SinglePost.vue'
export default {

    components: {SinglePost},

    props:['jovic'] , // if i want to use this post data in setup function , then i have to pass the props to the setup function

    setup(props){

    },

}
</script>

<style>

</style>