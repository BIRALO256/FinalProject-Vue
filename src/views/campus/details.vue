<template>

    <div v-if="lecture" >

    <h1>{{ lecture.title }}</h1>
    <p>the lecture id is {{ id }}</p>
    <p>this is the dtails {{ lectures.detail }}</p>

    </div>

    <div v-else>
    
        <p>Loading........</p>

    </div>

   
</template>

<script>
export default {
    props:['id'],
    data(){
        return{
            lecture :null // the detail data about the project is null but then we fill it after fetching it with the provided idS
        }
        // id:this.$route.params.id
    },
    mounted(){
        fetch('https://localhost:3000/lectures'+ this.id)
        .then(res=>res.json())
        .then(data =>this.lecture =data)
        .catch(err=> console.log(err.message))
    }
}
</script>

<style>

</style>