import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { globalConfig } from '../../configuration/config';

const Auth = () => {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const submit = async () => {
    let grant_type = 'password';
    let client_id = 'web-business-app';

    const form = new FormData();
    form.append('grant_type', grant_type);
    form.append('client_id', client_id);
    form.append('username', username);
    form.append('password', password);
    console.log(`${globalConfig.config.common.identity}token`);
    const res = await axios.post(`${globalConfig.config.common.identity}token`, form, {
      withCredentials: true,
    });
    const { data } = res;
    if (data?.access_token) {
      const obj = { access_token: data?.access_token };
      localStorage.setItem(
        `oidc.user:${globalConfig.config.auth.authority}:${globalConfig.config.auth.client_id}`,
        JSON.stringify(obj),
      );
      setToken(data?.access_token);
    }
  };
  return (
    <div className="wrapper-white">
      {token.length > 0 && <Redirect to="/" />}
      <div className="form auth">
        <input
          name="login"
          type="text"
          value={username}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={submit} className="submit">
          Войти
        </button>
      </div>
    </div>
  );
};

export default Auth;
