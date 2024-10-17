import React, { Component, useState, useEffect } from 'react';
import AuthService from './Services/AuthService';
import { globalConfig } from "./configuration/config";

export default function Refresh() {
  const [authService, setAuthService] = useState(new AuthService());

  useEffect(() => {
    authService.postrenewToken().catch((error) => {
     console.log(error);
    })
  }, []);

  return (
    <div>
      <title>Refresh</title>
    </div>
  )
}