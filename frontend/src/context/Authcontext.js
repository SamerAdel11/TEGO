import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Corrected import for jwtDecode
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedAuthTokens = localStorage.getItem('authTokens');
  const initialUser = storedAuthTokens ? jwtDecode(storedAuthTokens) : null;
  const [user, setUser] = useState(initialUser);
  const initialAuthTokens = storedAuthTokens ? JSON.parse(storedAuthTokens) : null;
  const [authTokens, setAuthTokens] = useState(initialAuthTokens);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const fetchUser = async () => {
    if (authTokens) {
      try {
        const response = await fetch('http://localhost:8000/verified/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        const data = await response.json();
        setUser({ ...jwtDecode(authTokens.access), verified: data.verified });
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const loginUser = async (formData) => {
    const response = await fetch('http://localhost:8000/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.passWord,
      }),
    });
    const tokens = await response.json();
    if (response.status === 200) {
      setAuthTokens(tokens);
      const loggedUser = jwtDecode(tokens.access);
      setUser(loggedUser);
      localStorage.setItem('authTokens', JSON.stringify(tokens));
      localStorage.setItem('supplierView', JSON.stringify(true));
      const supplierView = localStorage.getItem('supplierView');

      if (loggedUser.company_type === 'supplier' && supplierView !== false) {
        history.push('/open_tenders');
      } else {
        history.push('/mytender');
      }
    }
    return {
      status: response.status,
      message: tokens.detail || 'something went wrong',
    };
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    localStorage.removeItem('supplierView');
    history.push('/');
  };

  const updateToken = async () => {
    if (authTokens) {
      try {
        const response = await fetch('http://localhost:8000/token/refresh/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: authTokens.refresh }),
        });
        const tokens = await response.json();
        if (response.status === 200) {
          setAuthTokens(tokens);
          setUser(jwtDecode(tokens.access));
          localStorage.setItem('authTokens', JSON.stringify(tokens));
        } else {
          logoutUser();
        }
      } catch (error) {
        console.error('Error updating token:', error);
        logoutUser();
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      fetchUser();
    }
  }, [loading]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, 1000 * 60 * 60 * 23); // 23 hours

    return () => clearInterval(interval);
  }, [authTokens]);

  const contextData = {
    user,
    authTokens,
    login: loginUser,
    logout: logoutUser,
    loading,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
