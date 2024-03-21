import { createContext, useState , useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import { LocalSeeOutlined } from '@material-ui/icons';
import { useNavigate  } from 'react-router-dom'
const AuthContext=createContext()

export default AuthContext;

export const AuthProvider=({children})=>{
   
    let[user,setUser]=useState(()=>localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
    let[authTokens,setAuthTokens]=useState(()=>localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let[loading,setLoading] =useState(true)
    let navigate=useNavigate()

    let loginUser=async(e)=>{
        e.preventDefault()
        console.log('form submitted')
        let response=await fetch('http://localhost:8000/token/',
        {
            method : 'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                email:e.target.email.value,
                password:e.target.password.value
            })
        })
        let tokens=await response.json()
        if (response.status===200){
            setAuthTokens(tokens)
            console.log(jwtDecode(tokens.access))
            setUser(jwtDecode(tokens.access))
            localStorage.setItem('authTokens',JSON.stringify(tokens))
            navigate('/')
        }
        else{
            alert('something went wrong')
        }
    }

    let logoutUser=()=>{
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    let updateToken=async()=>{
        if(!authTokens){
            console.log('authTokens arew empty')
        }
        let response=await fetch('http://localhost:8000/token/refresh/',
        {
            method : 'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                'refresh':authTokens?.refresh
            })
        })
        let tokens = await response.json()
        console.log(response)
        console.log('refresh called')
        if (response.status===200){
            setAuthTokens(tokens)
            setUser(jwtDecode(tokens.access))
            localStorage.setItem('authTokens',JSON.stringify(tokens))
        }
        else{
            alert('something went wrong')
            logoutUser()
        }
        if(loading){
            setLoading(false)
        }
        
    }

    let contextData={
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser
    }

    useEffect(()=>{
        if(loading){
            updateToken()
        }
        let delaytime= 1000*60*60*23
        let interval = setInterval(()=>{
            if (authTokens){
                updateToken()
            }
        },delaytime)

        return ()=> clearInterval(interval)

    },[authTokens ])
    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}