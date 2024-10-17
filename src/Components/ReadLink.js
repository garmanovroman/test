import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router';
import Network from '../Components/Requests';
import { globalConfig } from '../configuration/config';
import AuthService from '../Services/AuthService';
import {
  setAccessToken,
  setActorNumber,
  setCalculationName,
  setChatGuid,
  setExtraUrlParams,
  setGuidCalculation,
  setProject,
  setTypes,
  setUserGuid,
  setRoomGuid,
} from '../store/reducers/inviteLinkSlice';
import InviteLinkRedirect from './InviteLinkRedirect';

export default function ReadLink() {
  const [token, setToken] = useState(false);
  const [authService, setAuthService] = useState(new AuthService());
  const dispatch = useDispatch();

  useEffect(() => {
    const processAsync = async () => {
      const params = new URL(document.location).searchParams;
      const guid = params.get('id');
      const send = await new Network().JoinProjectByLink(guid, globalConfig.config.auth.client_id);

      if (!send) {
        authService.logout();
        return;
      }

      new Network().IncrementCounter(send.projectGuid, 2, send.userGuid);
      // console.log(send);
      // throw new Error();

      // localStorage.clear();
      const obj = { access_token: send.accessToken };
      localStorage.setItem(
        `oidc.user:${globalConfig.config.auth.authority}:${globalConfig.config.auth.client_id}`,
        JSON.stringify(obj),
      );
      localStorage.setItem('types', send.linkType);
      localStorage.setItem('token', send.accessToken);
      localStorage.setItem('project', send.projectGuid);
      localStorage.setItem('guidCalculation', send.guidCalculation);
      localStorage.setItem('calculationName', send.calculationName);
      localStorage.setItem('room', send.room);
      localStorage.setItem('actorNumber', send.actorNumber);
      localStorage.setItem('joinLink', true);
      // localStorage.setItem('company', 'null');

      // Populate storage.
      dispatch(setTypes(send.linkType));
      dispatch(setAccessToken(send.accessToken));
      dispatch(setProject(send.projectGuid));
      dispatch(setGuidCalculation(send.guidCalculation));
      dispatch(setCalculationName(send.calculationName));
      dispatch(setActorNumber(send.actorNumber));
      dispatch(setExtraUrlParams(send.extraUrlParams));
      dispatch(setChatGuid(send.chatGuid));
      dispatch(setUserGuid(send.userGuid));
      dispatch(setRoomGuid(send.room));

      setToken(true);

      let types = localStorage.getItem('types');
      let guidCalculation = '';
      let calculationName = '';
      let project = '';
      let actorNumber = '';
      let extraUrlParams = send.extraUrlParams ?? '';
    };

    processAsync();
  }, []);

  return <div>{token == true ? <Route component={InviteLinkRedirect} /> : <></>}</div>;
}
