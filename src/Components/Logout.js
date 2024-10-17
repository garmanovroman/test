import axios from 'axios';
import React from 'react';
import { globalConfig } from '../configuration/config';
import { Redirect } from 'react-router';

const logoutUserAccount = async () => {
  await axios.get(`${globalConfig.config.common.identity}/endsession`, {
    withCredentials: true,
  });
  window.location.href = '/auth';
};

const Loguot = () => {
  return (
    <>
      <a id="logout" className="menu-item" onClick={logoutUserAccount}>
        Выйти
      </a>
    </>
  );
};

export default Loguot;
