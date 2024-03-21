import React,{useState,useEffect,useContext} from 'react'
import AuthContext from '../context/Authcontext'

const HomePage = () => {
    let [notes,setNotes]=useState([])
    let {authTokens,logoutUser}=useContext(AuthContext)

    useEffect(()=>{
        getNotes()
    },[])

    let getNotes=async()=>{
        let response=await fetch('http://localhost:8000/notes',{
            method : 'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer '+String(authTokens.access)
            }
        })
        let data=await response.json()
        if(response.status===200){
            setNotes(data)
        }
        else if (response.statusText==='Unauthorized'){
            logoutUser()
            console.log('unauthorized so we logged you out')

        }
    }
  return (
    <div>
      <p>you are logged in to the home page</p>
      <ul>
        {notes.map(note=>(
            <li key={note.id}>
                {note.body}
            </li>
        ))}
      </ul>
    </div>
  )
}

export default HomePage
