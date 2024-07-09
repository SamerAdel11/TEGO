import React, { useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import AuthContext from '../../context/Authcontext';

function ActivationPage() {
  const { uidb64, token } = useParams();
  const { user, setUser, authTokens } = useContext(AuthContext);
  const history = useHistory();
  useEffect(() => {
    const navigateToAnotherPage = () => {
      setTimeout(() => {
        history.push('/host');
      }, 2000); // Delay navigation for 5000 milliseconds (5 seconds)
    };
    const activateUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/activate/${uidb64}/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        if (response.ok) {
          setUser({ ...user, verified: true });
          history.push('/host');
          navigateToAnotherPage();
        }
      } catch (error) {
        console.error('Error activating account:', error);
      }
    };

    activateUser();
  }, [uidb64, token]); // Include handleToggleActive in the dependency array

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      {true !== null && (
        <>
          {true ? (
            <div>
              <h2>Account Activated!</h2>
              <p>You will be navigated in 5 seconds</p>
            </div>
          ) : (
            <div>
              <h2>Activation Failed</h2>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ActivationPage;
