/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';

import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/Authcontext';

function renderComponentOrRedirect(props, Component, user, loading) {
  console.log(loading);
  if (loading) {
    return <div>Loading...</div>;
  }
  console.log('user from private route', user);
  if (user && user.verified) {
    console.log('user', user);
    return <Component {...props} />;
  }
  if (user && !user.verified) {
    return <Redirect to={{ pathname: '/waiting_for_verification', state: { from: props.location } }} />;
  }
  return (
    <Redirect
      to={{ pathname: '/signin', state: { from: props.location } }}
    />
  );
}

function PrivateRoute({ component: Component, ...rest }) {
  const { user, loading } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) => renderComponentOrRedirect(props, Component, user, loading)}
    />
  );
}

export default PrivateRoute;
