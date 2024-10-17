import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setList,
  setCurrent,
  add,
  deleteItem,
  changeUserState,
  setLockImg,
} from '../store/reducers/variantSlice';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { globalConfig } from '../configuration/config';
import Network from '../Components/Requests';
import { setProjectUserCounters, setGroupUpdate } from '../store/reducers/projectSlice';
import {} from '../store/reducers/saveGuids';
import { setHub } from '../store/reducers/hubSlice';
import async from 'marzipano/src/util/async';

export default function SignalR(props) {
  const dispatch = useDispatch();

  const companyId = useSelector((state) => state.project.companyId);
  const projectGuid = useSelector((state) => state.variant.current?.projectGuid);
  const calculationGuid = useSelector((state) => state.variant.current?.calculationGuid);
  const currentVariant = useSelector((state) => state.variant.current);
  const hub = useSelector((state) => state.hub.hubs);
  const variants = useSelector((state) => state.variant.list);
  const user = useSelector((state) => state.users?.currentUser?.guid);

  useEffect(() => {
    if (Object.keys(hub).length == 0 && user?.length > 0) {
      const newConnection = new HubConnectionBuilder()
        .withUrl(
          `${globalConfig.config.common.apiChat}chatHub?userGuid=${user}&companyId=${companyId}&projectGuid=${projectGuid}&roomGuid=${calculationGuid}`,
        )
        .withAutomaticReconnect()
        .build();

      newConnection
        .start()
        .then((result) => {
          console.log('ConnectSignalStart', newConnection);
        })
        .then((result) => {
          props.setConnection(newConnection);
          dispatch(setHub(newConnection));
        })
        .catch((e) => console.log('Connection failed: ', e));
    }
  }, [user]);

  useEffect(() => {
    if (hub?.connectionStarted) {
      const fetch = async () => {
        let a;
        if (Number(companyId) && String(calculationGuid) && String(projectGuid)) {
          a = await hub.invoke(
            'ChangeConnectionInfo',
            Number(companyId),
            String(projectGuid),
            String(calculationGuid),
          );
          console.log('ConnectSignalUpdate', a);
        }
      };
      fetch();
    }
  }, [calculationGuid, companyId]);

  useEffect(() => {
    if (hub.connectionStarted) {
      hub.on('AddedVariant', (variant) => {
        if (variant.projectGuid == projectGuid) {
          dispatch(add(variant));
          // dispatch(setLockImg(true));
          dispatch(setCurrent(variant));
        }
      });
      hub.on('ActiveProjectsInGroupChanged', (group) => {
        // console.log(group, 'groupgroup1');
      });
      hub.on('DeletedVariant', (variant) => {
        dispatch(deleteItem(variant));
      });
      hub.on('AddedNewProjectForUser', (project) => {
        props.addProject(project);
      });
      hub.on('ProjectAdded', (project) => {
        props.addProject(project);
      });
      hub.on('DeletedProjectForUser', (project) => {
        props.deleteProject(project);
      });
      hub.on('AddedUser', (user) => {
        dispatch(changeUserState(user));
      });
      hub.on('DeletedUser', (user) => {
        dispatch(changeUserState(user));
      });
      hub.on('ProjectIconChanged', (icon) => {
        props.iconProjectChange(icon);
      });
      hub.on('ProjectCounterIncremented', (counter) => {
        props.incrementCounter(counter);
        dispatch(setProjectUserCounters(counter.projectUserCounters));
      });
      hub.on('GroupAdded', (group) => {
        dispatch(setGroupUpdate(group));
      });
      hub.on('GroupDeleted', (group) => {
        dispatch(setGroupUpdate(group));
      });
      hub.on('ProjectsInGroupUpdated', (group) => {
        dispatch(
          setGroupUpdate({
            group: group,
            setProject: true,
          }),
        );
      });
      hub.on('MessagesRead', (mes) => {
        props.readMessage(mes);
      });
      hub.on('CalculationUpdated', async (guid) => {
        const variantIndex = variants.findIndex((el) => el.calculationGuid == guid);
        const calculation = await new Network().GetCalculationViews(guid);

        const arrCopy = JSON.parse(JSON.stringify(variants));
        arrCopy[variantIndex].iconPath = calculation?.mainIconPath;
        arrCopy[variantIndex].timestamp = calculation?.timestamp;
        dispatch(setList(arrCopy));

        if (guid == calculationGuid) {
          const updatedVariant = {
            ...currentVariant,
            sphere_360Path: calculation.sphere_360Path,
            sequenceData: calculation.sequenceData,
            timestamp: calculation.timestamp,
          };

          dispatch(setCurrent(updatedVariant));
          const message = {
            type: 'calculationUpdated',
            value: calculation.mainIconPath,
          };
          var iFrame = document.getElementById('view-container-iframe');
          if (iFrame != null) {
            iFrame.contentWindow.postMessage(message, '*');
          }
        }
      });
      return () => {
        hub.off('AddedVariant');
        hub.off('ActiveProjectsInGroupChanged');
        hub.off('DeletedVariant');
        hub.off('AddedNewProjectForUser');
        hub.off('DeletedProjectForUser');
        hub.off('AddedUser');
        hub.off('DeletedUser');
        hub.off('ProjectIconChanged');
        hub.off('ProjectCounterIncremented');
        hub.off('GroupAdded');
        hub.off('GroupDeleted');
        hub.off('ProjectsInGroupUpdated');
        hub.off('CalculationUpdated');
      };
    }
  }, [hub, projectGuid, calculationGuid]);

  // событие на изменение иконки проекта
  // newConnection.on('ProjectIconChanged', async (projectGuidWithIconPath) => {
  //   // изменить иконку у проекта
  //   var searchedProjectIndex = this.state.projects.findIndex(
  //     (p) => projectGuidWithIconPath.guidProject === p.projectGuid,
  //   );
  //   if (searchedProjectIndex >= 0) {
  //     let copyOfProjects = [...this.state.projects];
  //     copyOfProjects[searchedProjectIndex].projectSmallPicturePath =
  //       projectGuidWithIconPath.smallPicturePath;
  //     await this.setState({
  //       projects: copyOfProjects,
  //     });
  //   }
  // });

  return <></>;
}
