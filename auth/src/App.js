import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header';
import PrivateRoute from './utils/PrivateRoute'
import AuthContext, { AuthProvider } from './context/Authcontext';
function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header/>
          <Routes>

            <Route element={<PrivateRoute/>}>
              <Route element={<HomePage/>} path='/' exact/>
            </Route>

            <Route element={<LoginPage/>} path= '/login'/>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
