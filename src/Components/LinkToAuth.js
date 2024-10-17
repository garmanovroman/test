import axios from 'axios';
import React from 'react';
import { globalConfig } from '../configuration/config';
import { Redirect } from 'react-router';

const LinkToAuth = () => {
  return (
    <div className="flex-auth">
      <a id="logout" href="/auth" className="menu-item">
        Авторизироваться
      </a>
    </div>
  );
};

export default LinkToAuth;
