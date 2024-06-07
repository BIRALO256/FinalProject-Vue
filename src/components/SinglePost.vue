<template>
    <br>
    <div class="post">
       
            
        <h3>{{ snippet}}</h3>
        <h3>{{ posts.id }}</h3>
       
    </div>

</template>

<script>
import { computed } from 'vue'
export default {
    props : ['posts'],

    setup(props){
            const snippet = computed(()=>{
                return props.posts.body.substring(0,100) + '....' // here you trim the body cotent to have maximum 100 characters
            })
            return {snippet}
    }
}
</script>

<style>

</style>