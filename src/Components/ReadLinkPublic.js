import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route } from 'react-router';
import Network from '../Components/Requests';
import { globalConfig } from '../configuration/config';
import { v4 as uuidv4 } from 'uuid';
import AuthService from '../Services/AuthService';
import { setCompany } from '../store/reducers/projectSlice';
import { useNavigate } from 'react-router-dom';

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
  setStartup3DType,
} from '../store/reducers/inviteLinkSlice';
import {} from '../store/reducers/variantSlice';
import {} from '../store/reducers/projectSlice';
import InviteLinkRedirect from './InviteLinkRedirect';

export default function ReadLinkPublic() {
  const [token, setToken] = useState(false);
  const [authService, setAuthService] = useState(new AuthService());
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // navigate('/app');

  useEffect(() => {
    const processAsync = async () => {
      const params = new URL(document.location).searchParams;
      const guid = params.get('id');
      const companyId = JSON.parse(localStorage.getItem('company'))?.id;
      // console.log(localStorage.getItem('company'));
      // console.log(companyId, 'companyIdcompanyId');

      const uuidLocal = localStorage.getItem('uuid');
      let uuid = '';
      if (uuidLocal === null) {
        uuid = uuidv4();
        localStorage.setItem('uuid', uuid);
      } else {
        uuid = uuidLocal;
      }

      const go = await new Network().FollowPublicLink(guid, uuid);

      // throw new Error('Whoops!');

      new Network().IncrementCounter(go.projectGuid, 2, go.userGuid);

      const obj = { access_token: go.accessToken };
      localStorage.setItem(
        `oidc.user:${globalConfig.config.auth.authority}:${globalConfig.config.auth.client_id}`,
        JSON.stringify(obj),
      );
      localStorage.setItem('types', go.linkType);
      localStorage.setItem('token', go.accessToken);
      localStorage.setItem('project', go.projectGuid);
      localStorage.setItem('guidCalculation', go.guidCalculation);
      localStorage.setItem('calculationName', go.calculationName);
      localStorage.setItem('room', go.room);
      localStorage.setItem('actorNumber', go.actorNumber);
      localStorage.setItem('uuid', uuid);
      localStorage.setItem('joinLink', true);
      localStorage.setItem('startup3DType', go?.startup3DType);

      localStorage.setItem('company', JSON.stringify({ id: go?.idCompany }));

      //   // Populate storage.
      dispatch(setTypes(go.linkType));
      dispatch(setAccessToken(go.accessToken));
      dispatch(setProject(go.projectGuid));
      dispatch(setGuidCalculation(go.guidCalculation));
      dispatch(setCalculationName(go.calculationName));
      dispatch(setActorNumber(go.actorNumber));
      dispatch(setExtraUrlParams(go.extraUrlParams));
      dispatch(setChatGuid(go.chatGuid));
      dispatch(setUserGuid(go.userGuid));
      dispatch(setRoomGuid(go.room));
      dispatch(setCompany(go?.idCompany));
      dispatch(setStartup3DType(go?.startup3DType));

      setToken(true);

      let types = localStorage.getItem('types');
      let guidCalculation = '';
      let calculationName = '';
      let project = '';
      let actorNumber = '';
      let extraUrlParams = go.extraUrlParams ?? '';
    };

    processAsync();
  }, []);

  return <div>{token == true ? <Route component={InviteLinkRedirect} /> : <></>}</div>;
}
