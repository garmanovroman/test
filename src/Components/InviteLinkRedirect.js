import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router';
import { globalConfig } from '../configuration/config';
import Network from './Requests';
import Stor from './Stories';

export default function InviteLinkRedirect() {
  const types = useSelector((state) => state.inviteLink.types);
  const guidCalculation = useSelector((state) => state.inviteLink.guidCalculation);
  const calculationName = useSelector((state) => state.inviteLink.calculationName);
  const project = useSelector((state) => state.inviteLink.project);
  const actorNumber = useSelector((state) => state.inviteLink.actorNumber);
  const accessToken = useSelector((state) => state.inviteLink.accessToken);
  const extraUrlParams = useSelector((state) => state.inviteLink.extraUrlParams) ?? '';
  const userGuid = useSelector((state) => state.inviteLink.userGuid);
  const chatGuid = useSelector((state) => state.inviteLink.chatGuid);
  const room = useSelector((state) => state.inviteLink.room);
  const startup3DType = useSelector((state) => state.inviteLink?.startup3DType);

  useEffect(() => {
    const processRedirectAsync = async () => {
      if (types == 'ThreeD') {
        if (startup3DType == 1) {
          document.location.href = `${globalConfig.config.common.vroom}/?calculation=${guidCalculation}&room=${guidCalculation}&project=${project}${extraUrlParams}`;
        }
        if (startup3DType == 2) {
          document.location.href = `${globalConfig.config.common.widget}v0/calculation/${guidCalculation}?project=${project}&room=${guidCalculation}`;
        }
      } else if (types == 'Guide') {
        document.location.href = `${globalConfig.config.common.vroom}/?calculation=${guidCalculation}&room=${guidCalculation}&project=${project}&guide=${actorNumber}${extraUrlParams}`;
      } else if (types == 'Graphics') {
        const calculationInfo = await new Network().getCalculationInfo(guidCalculation);
        const sequenceData = calculationInfo?.views?.sequenceData;
        const spherePath = calculationInfo?.views?.sphere_360Path;

        if (spherePath != 'undefined' && spherePath != null) {
          document.location.href = `${globalConfig.config.common.view}?guid=${spherePath}&back=true`;
        } else {
          const userInfo = await new Network().GetUsersInfo();
          document.location.href = `${globalConfig.config.common.view}sequence.html?path=${sequenceData?.sequencePath}&count=${sequenceData?.sequenceCount}&first=${sequenceData?.sequenceFirst}&ext=${sequenceData?.sequenceExt}&guid=${guidCalculation}&user=${userGuid}&chat=${chatGuid}&project=${guidCalculation}&projectGuid=${project}&name=${userInfo?.name}&back=true`;
        }
      } else if (types == 'Stories') {
        return;
      } else {
        document.location.href = `/app?pr=${project}&variant=${guidCalculation}`;
      }
    };

    processRedirectAsync();
  }, []);

  return (
    <div>
      {types == 'Stories' && (
        <Route>
          <Stor chatGuid={chatGuid} userGuid={userGuid} project={project} />
        </Route>
      )}
    </div>
  );
}
