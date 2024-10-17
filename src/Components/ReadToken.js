import React, { useState, useEffect } from 'react';
import Main from '../Pages/Main';
import AuthService from '../Services/AuthService';
import Network from '../Components/Requests';
import { Redirect } from 'react-router';
import LinkToAuth from './LinkToAuth';
import axios from 'axios';
import { globalConfig } from '../configuration/config';

const ReadToken = () => {
  const [authService, setAuthService] = useState(new AuthService());
  const [user, setUser] = useState(null);
  const [userGuid, setUserGuid] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const data = await new Network().GetUserGuid();

      let grant_type = 'refresh_token';
      let client_id = 'web-business-app';

      const form = new FormData();
      form.append('grant_type', grant_type);
      form.append('client_id', client_id);

      if (!data) {
        const res = await axios.post(`${globalConfig.config.common.identity}token`, form, {
          withCredentials: true,
        });
        const datas = await new Network().GetUserGuid();
        setUser(datas);
      }

      setUser(data);

      window.addEventListener('message', function (e) {
        if (e.data.type == 'request_token') {
          var message = {
            type: 'token',
            value: data.access_token,
          };
          var iFrame = document.getElementById('view-container-iframe');

          if (iFrame != null) {
            iFrame.contentWindow.postMessage(message, '*');
          }
        }
      });
    };

    localStorage.removeItem('types');
    getUser();
  }, [user]);

  return <div>{user ? <Main user={userGuid} /> : <LinkToAuth />}</div>;
};

export default ReadToken;
