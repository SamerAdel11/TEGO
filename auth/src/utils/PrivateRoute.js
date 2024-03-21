import { Outlet, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/Authcontext'
const PrivateRoute=({}) => {
    let {user}=useContext(AuthContext)
    console.log("private route works")
    return(
        user? <Outlet/>: < Navigate to='/login' />
    )
}
export default PrivateRoute