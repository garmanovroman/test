import React, { Component, useState } from 'react';
import AuthService from './Services/AuthService';
import { globalConfig } from './configuration/config';
import { Link } from 'react-router-dom';

function Callback() {
  const [authService, setAuthService] = useState(new AuthService());
  const [user, setUser] = useState(null);

  authService
    .postlogin()
    .then((user) => {
      setUser(user);
      window.location.href = globalConfig.config.auth.post_logout_redirect_uri;
    })
    .catch((error) => {
      console.log(error);
    });

  authService
    .postLogout()
    .then((user) => {
      setUser(null);
      console.log(user);
      window.history.replaceState(
        {},
        window.document.title,
        window.location.origin + window.location.pathname,
      );
      window.location.href = globalConfig.config.auth.post_logout_redirect_uri;
    })
    .catch((error) => {
      console.log(error);
    });

  return (
    <div>
      <title>Callback</title>
      {user && <Link to={globalConfig.config.auth.post_logout_redirect_uri} />}
    </div>
  );
}

export default Callback;
