import React, { useEffect } from 'react';
import ActionProject from './ActionProject';
import { globalConfig } from '../configuration/config';
import { useSelector, useDispatch } from 'react-redux';
import DescriptionProject from './DescriptionProject';
import { clearUsers, setProject, setUserGuid, setDisplayType } from '../store/reducers/saveGuids';
import { setUserList } from '../store/reducers/usersSlice';
import { linkActive } from '../store/reducers/linkSlice';
import OpenNewLink from './OpenNewLink';
import { setPrevGuidChat } from '../store/reducers/saveGuids';
import usePrevious from './hooks/usePrevious';

function num_word(value, words) {
  value = Math.abs(value) % 100;
  var num = value % 10;
  if (value > 10 && value < 20) return words[2];
  if (num > 1 && num < 5) return words[1];
  if (num == 1) return words[0];
  return words[2];
}

Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

const TopPanelProject = (props) => {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const [currentPro, setCurrentPro] = React.useState(false);

  useEffect(() => {
    dispatch(setUserGuid(props?.user));
    if (props?.current?.forDisplayTape == false) {
      dispatch(setProject(props.current.projectGuid));
      dispatch(setDisplayType(''));
    } else {
      dispatch(setDisplayType(props.current.guidDisplayTape));
    }
    dispatch(setUserList(props?.current?.users));
    setCurrentPro(current?.projectGuid);
    sendPrevGuid();
  }, [props.current]);

  const current = useSelector((state) => state.variant.current);
  const saveProjectGuid = useSelector((state) => state?.guids?.project);
  const guidDisplayTypeStore = useSelector((state) => state?.guids?.guidDisplayType);
  const saveVariant = useSelector((state) => state.project.saveVariant);
  const countUser = useSelector((state) => state.project?.countUser);
  const statusOpen = useSelector((state) => state.project.templateStatusOpen);
  const prev = usePrevious(current?.projectGuid);

  function sendPrevGuid() {
    if (prev == current?.projectGuid) {
      props.onGetPrev(prev);
    }
  }

  function createChats() {
    props.onEnabledChat(props.current.projectGuid);
  }

  if (typeof window.clickThreeD !== 'function') {
    window.clickThreeD = (calculation, e) => {
      e.preventDefault();
      // document.location.href = e.target.getAttribute('href');
      dispatch(linkActive(true));

      return false;
    };
  }

  const openProject = (e) => {
    e.preventDefault();
    var cusid_ele = document.getElementsByClassName('projects');
    cusid_ele[0].classList.toggle('active');
    var cusid_ele = document.getElementsByClassName('open-project');
    cusid_ele[0].classList.toggle('active');
  };

  const handlerOpenProjectDescription = () => {
    if (props.current.forDisplayTape == false) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="top_panel">
      <OpenNewLink />
      <div className="flex">
        <div className="top_panel--descr">
          {Object.keys(props.current).length > 0 && (
            <img
              className={'top_panel--img ' + (props.current.forDisplayTape ? '' : 'active')}
              src={`${
                props.current.projectSmallPicturePath !== null
                  ? props.current.projectSmallPicturePath
                  : 'https://fakeimg.pl/795/400'
              }`}
              onClick={handlerOpenProjectDescription}
            />
          )}
          <a
            target=""
            href=""
            id="panel--view"
            className="panel--view small"
            onClick={(e) => openProject(e)}>
            1D
          </a>
          {Object.keys(props.current).length > 0 && (
            <div>
              <div
                className={'top_panel--name ' + (props.current.forDisplayTape ? '' : 'active')}
                onClick={handlerOpenProjectDescription}>
                {props.current.name.length > 65
                  ? props.current.name.substring(0, 65) + '...'
                  : props.current.name}
              </div>
            </div>
          )}
          <DescriptionProject
            show={open}
            current={props.current}
            close={handleClose}
            onUpdateProject={props.onUpdateProject}
          />
        </div>
        <div className="top_panel--right">
          {Object.keys(props.current).length > 0 && props.current.forDisplayTape == false && (
            <>
              <div
                className="top_panel--group users-group "
                onClick={handlerOpenProjectDescription}>
                {props.current?.users?.map((user, index) => {
                  return (
                    index <= 2 && (
                      <div
                        className="user-top"
                        style={{ backgroundImage: `url(${user.profilePicturePath})` }}></div>
                    )
                  );
                })}
                <span>{countUser}</span>
              </div>
            </>
          )}
          {current?.calculationGuid &&
            Object.keys(props.current).length > 0 &&
            (props.current.forDisplayTape == true ? (
              <a
                // target="_blank"
                href={`${globalConfig.config.common.vroom}?calculation=${
                  current?.calculationGuid
                }&project=${saveVariant ? saveProjectGuid : guidDisplayTypeStore}&room=${
                  current?.calculationGuid
                }_${props.user}&isCatalog=${statusOpen}`}
                id="panel--view"
                className="panel--view openthreed"
                onClick={(e) => window.clickThreeD(current?.calculationGuid, e)}>
                3D
              </a>
            ) : (
              <a
                // target="_blank"
                href={`${globalConfig.config.common.vroom}?calculation=${
                  current?.calculationGuid
                }&project=${saveVariant ? saveProjectGuid : current?.projectGuid}&room=${
                  current?.calculationGuid
                }&isCatalog=${statusOpen}`}
                id="panel--view"
                className="panel--view openthreed"
                onClick={(e) => window.clickThreeD(current?.calculationGuid, e)}>
                3D
              </a>
            ))}
          {Object.keys(props.current).length > 0 && (
            <ActionProject
              onDeleteProject={props.onDeleteProject}
              variantGuid={props.variantGuid}
              usersCompany={props.usersCompany}
              current={props.current}
              companyId={props.companyId}
              companyName={props.companyName}
              changeBaseProject={props.changeBaseProject}
              isOpenCatalog={props.isOpenCatalog}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopPanelProject;
