//we are using this div just for the else part since we can't loop through an empty in this page componet because we get the the data from the end point anyway
<template>

<nav>
    <router-link :to="{name:home}">Products</router-link> |
    <router-link :to="{name: 'about'}" class="">About</router-link> |
    <router-link :to ="{name:'course'}">lectures</router-link>
    
  </nav>

    <div v-if="lectures.length"> 
            <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 class="text-3xl font-bold mb-6 text-gray-800">Available Lectures</h1>
            <div v-for="campus in lectures" :key="campus.id" class="mb-4">
            <router-link
                :to="{ name: 'lectures', params: { id: campus.id } }"
                class="block p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow transition"
            >
                <h2 class="text-xl font-semibold text-blue-600 bg-black ">{{ campus.title }}</h2>
            </router-link>
            </div>
        </div>
    </div>
    
    <div v-else>
        <p>Still loadingS</p>
    </div>
   
</template>

<script>
export default {
    data(){
        return{
            lectures :[
                {title: 'Software design preciples',id :1 ,details:'lorem12'},
                {title: 'Embeded systems',id :2 ,details:'lorem12'},
                {title: 'computer leture',id :3 ,details:'lorem12'},
            ]
        }
    },
    mounted(){
        //fetch returns a promise meaning it takes some time to return the object of data , res methon also returns a promis meaning we use data to get the acutual data
        fetch('https://localhost:3000/lectures')
        .then(res=>res.json())
        .then(data =>this.lectures =data)
        .catch(err=> console.log(err.message))// we assign the data of to lectures array or any array we have to populate with the data i get
        // we use catch to get the erro incase we don't get the expected data
    }
}
</script>

<style>

</style>