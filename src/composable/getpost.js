
import {ref} from 'vue'

const  getPosts =()=>{
    const  posts =ref([
        // {title: 'welcome my g',body : 'lorem100 Here s a full example, including a data fetching component. Heres a full example, including a data fetching component. Heres a full example, including a data fetching component.' , id:1},
        // {title: 'About what i want ',body : 'i want movies, music , footbal , games and more ' , id:2}
    ])
    const error = ref(null)

    const load = async () =>{
        try{
        let data = await fetch('https://localhost:3000/lectures')
        if(!data.ok){
        throw  Error('no data available')
        }/// if we are facing an error , that the way to catch it
          posts.value =await data.json() // if the data is available then we turn it it an object using json methode , we use await to wait for the data and then store it since it returns a promis

        }
        catch(err){
        error.value =err.message
    }

    }
    return {posts ,error ,load } // we  return the data that we want to access in a component when it needed to be used 
}

export default getPosts   // we do this so that we are in postion to import this file when it's need in another component 