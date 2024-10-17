import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import AuthService from '../../Services/AuthService';
import { globalConfig } from '../../configuration/config';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Network from '../../Components/Requests';

const Home = () => {
  let windowUrl = window.location.search;
  const [authService, setAuthService] = useState(new AuthService());
  const [user, setUser] = useState();
  useEffect(() => {
    getUser();
  }, []);

  function login() {
    authService.login();
  }

  function logout() {
    localStorage.removeItem('company');
    authService.logout();
  }

  function getUser() {
    const fetch = async () => {
      const result = await new Network().GetUserGuid();
      setUser(result);
    };
    fetch();
    // if (authService) {
    //   authService.getUser().then((user) => {
    //     if (user) {
    //       setUser(user);
    //     } else {
    //       console.log('You are not logged in.');
    //     }
    //   });
    // }
  }

  return (
    <div className="wrapper">
      {user ? (
        <Redirect to="/app" />
      ) : (
        <>
          <header>
            <div className="logo-container">
              <a aria-current="page" class="" href="/">
                System123
              </a>
            </div>
            <Link to="/auth" className="narrow">
              Войти
            </Link>
            {/* <button onClick={login} className="narrow">
              Войти
            </button> */}
          </header>
          <main>
            <div className="page-index">
              <div className="top-of-page">
                <div class="circle-container loaded">
                  <svg height="1030" width="1030" class="bg-circle">
                    <circle
                      cx="615"
                      cy="515"
                      r="515"
                      stroke="#9c9c9c"
                      stroke-width="1"
                      stroke-dasharray="3236 3236"
                      fill="none"
                      stroke-dashoffset="0"></circle>
                  </svg>
                </div>
              </div>
            </div>
            <div class="content-container hero-wrapper"></div>
          </main>
        </>
      )}
    </div>
  );
};

export default Home;
