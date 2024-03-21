import React,{useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/Authcontext'
const Header = () => {
    let {user,logoutUser}=useContext(AuthContext)
  return (
    <div>
      <Link to='/'>Home</Link>
      <span> | </span>
      {user?(
        <p onClick={logoutUser}>logout</p>
      ):(
        <Link to='/login'>Login</Link>
      )}
      {user && <p>Hello {user.email} </p>}
      
    </div>
  )
}

export default Header
