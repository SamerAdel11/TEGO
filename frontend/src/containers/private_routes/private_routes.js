/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/Authcontext';

function renderComponentOrRedirect(props, Component, user, loading, allowedRoles) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && (!allowedRoles || allowedRoles.includes(user.company_type))) {
    return <Component {...props} />;
  }
  if (user) {
    return (
      <Redirect
        to={{ pathname: '/not_found', state: { from: props.location } }}
      />
    );
  }

  return (
    <Redirect
      to={{ pathname: '/signin', state: { from: props.location } }}
    />
  );
}

function PrivateRoute({ component: Component, allowedRoles, ...rest }) {
  const { user, loading } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) => renderComponentOrRedirect(props, Component, user, loading, allowedRoles)}
    />
  );
}

export default PrivateRoute;
