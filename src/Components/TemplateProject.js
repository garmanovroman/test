import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Network from './Requests';
import {
  addBreadcrumbs,
  clearList,
  levelDecrement,
  levelIncrement,
  removeBreadcrumbs,
  setCompany,
  setNeedUpdate,
  setParentStructureId,
  setTemplateAdd,
  setTemplateList,
  setTemplateSelection,
  templateOpenStatus,
  setSaveVariant,
  setIdAccess,
  setCountUser,
} from '../store/reducers/projectSlice';
import { setLoader } from '../store/reducers/preloaderSlice';
import defaultImg from '../images/def_chat.png';
import AddingProjectTemplate from './AddingProjectTemplate';

export default function TemplateProject(props) {
  const [show, setShow] = React.useState(false);
  const dispatch = useDispatch();
  const openStatus = useSelector((state) => state.project.templateStatusOpen);
  const templateList = useSelector((state) => state.project.templateList);
  const prevParentStructureId = useSelector((state) => state.project.currentParentStructureId);
  const breadcrumbsList = useSelector((state) => state.project.breadcrumbs);
  const levelCatalog = useSelector((state) => state.project.levelCatalog);
  const needUpdate = useSelector((state) => state.project.needUpdate);
  const templateSelect = useSelector((state) => state.project.templateSelect);
  const templateAdd = useSelector((state) => state.project.templateAdd);
  const company = useSelector((state) => state.project.companyId);
  const currentVariant = useSelector((state) => state?.variant?.current?.calculationGuid);
  const saveProjectGuid = useSelector((state) => state?.guids?.project);
  const userGuid = useSelector((state) => state?.guids?.userGuid);
  const idAccess = useSelector((state) => state?.project?.idAccess);

  let timer = 0;

  const next = async (idCompany, id, name, guid, baseCalculationGuid, isAllChats, idAccess) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (id > 0 && company > 0 && idAccess == null) {
        dispatch(setParentStructureId(id));
        dispatch(addBreadcrumbs({ name: name, id: id, idAccess: idAccess }));
        dispatch(levelIncrement());
      } else if (id == 0 && isAllChats == true && guid == null && idAccess == null) {
        dispatch(setParentStructureId(id));
        dispatch(addBreadcrumbs({ name: name, id: id }));
        dispatch(levelIncrement());
      } else if (id == 0 && isAllChats == true && guid.length > 0 && idAccess == null) {
        dispatch(setTemplateSelection(guid));
        const project = await new Network().GetBaseProject(guid);
        props.setCurrentProject(project);
      } else if (idAccess > 0) {
        dispatch(setParentStructureId(id));
        dispatch(setIdAccess(idAccess));
        dispatch(addBreadcrumbs({ name: name, id: id, idAccess: idAccess }));
        dispatch(levelIncrement());
      } else {
        dispatch(setTemplateAdd(baseCalculationGuid));
        const data = await new Network().getUsersProject(guid);
        dispatch(setCountUser(data?.length));
        new Network()
          .AddDisplayTape(baseCalculationGuid, guid, userGuid, company)
          .then((result) => {
            props.onAddProject(result, true, false, null, [], false);
            dispatch(setTemplateSelection(guid));
          });
      }
    }, 250);
  };

  const back = async (prevParentStructureId) => {
    dispatch(removeBreadcrumbs());
    dispatch(levelDecrement());
    dispatch(setParentStructureId(breadcrumbsList[breadcrumbsList.length - 2].id));
    dispatch(setIdAccess(breadcrumbsList[breadcrumbsList.length - 2].idAccess));
  };

  useEffect(() => {
    let structure = [];
    const fetch = async () => {
      if (breadcrumbsList.length == 1) {
        if (company != 'null' && company > 0) {
          structure = await new Network().GetCatalog(company, '', true, idAccess);
        }
      } else {
        structure = await new Network().GetCatalog(company, prevParentStructureId, true, idAccess);
      }
      dispatch(setTemplateList(structure));
      dispatch(setNeedUpdate(false));
      // dispatch(setCompany(storageCompany?.id));
    };

    fetch();
  }, [needUpdate, breadcrumbsList, company, props.displayTape]);

  /////////////////////////
  const [anchorEl, setAnchorEl] = React.useState(null);
  const companyId = useSelector((state) => state?.project?.companyId);
  const projectUnite = useSelector((state) => state?.project?.list);
  const saveVariant = useSelector((state) => state?.project?.saveVariant);

  const handleClick = (event) => {
    projectUnite.length > 0 ? setAnchorEl(event.currentTarget) : dispatch(templateOpenStatus(true));
  };

  const handleClickClose = (event) => {
    if (projectUnite.length > 0) {
      setAnchorEl(event.currentTarget);
    } else {
      dispatch(templateOpenStatus(false));
      dispatch(removeBreadcrumbs());
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const saveProject = async (
    name,
    number,
    address,
    fullName,
    phone,
    clientEmail,
    amoLink,
    source,
    productType,
    sum,
    requestDate,
    orderDate,
    expirationDate,
    orderCompletionDate,
    archivedDate,
    feedback,
    descr,
    workCosts,
    materialCosts,
    costsNote,
  ) => {
    if (saveVariant) {
      dispatch(setLoader(true));
      const send = new Network()
        .AddVariant(currentVariant, saveProjectGuid, name)
        .then((result) => {
          props.onAddProject([], false, true, saveProjectGuid);
          dispatch(clearList());
          let com = companyId;
          props.changeCatalog(false);
          dispatch(setCompany(com));
          setShow(false);
          dispatch(setSaveVariant(false));
          var cusid_ele = document.getElementsByClassName('projects');
          cusid_ele[0].classList.toggle('active');
          var cusid_ele = document.getElementsByClassName('open-project');
          cusid_ele[0].classList.toggle('active');
          dispatch(setLoader(false));
        });
    } else {
      dispatch(setLoader(true));
      new Network()
        .addUserProject(
          name,
          descr,
          companyId,
          templateAdd,
          true,
          number,
          address,
          fullName,
          phone,
          clientEmail,
          amoLink,
          source,
          productType,
          sum,
          new Date(requestDate),
          new Date(orderDate),
          new Date(expirationDate),
          new Date(orderCompletionDate),
          new Date(archivedDate),
          feedback,
          workCosts,
          materialCosts,
          costsNote,
        )
        .then((result) => {
          new Network().getUsersProject(result.projectGuid).then((res) => {
            result.users = res;
          });
          props.onAddProject(result);
          props.changeCatalog(false);
          dispatch(clearList());
          let com = companyId;
          dispatch(setCompany(com));
          setShow(false);
          dispatch(setLoader(false));
          var cusid_ele = document.getElementsByClassName('projects');
          cusid_ele[0].classList.toggle('active');
          var cusid_ele = document.getElementsByClassName('open-project');
          cusid_ele[0].classList.toggle('active');
        });
    }
  };

  /////////////////////////

  return (
    <div className={openStatus == true ? 'template-projects active' : 'template-projects'}>
      <div className="project-breadcrumbs">
        {breadcrumbsList.length > 0 && (
          <div className="breadcrumb-back" onClick={breadcrumbsList.length > 1 && back}></div>
        )}
        <div className="breadcrumb-title">
          {breadcrumbsList.length > 0 &&
            breadcrumbsList.slice(-2).map((breadcrumb, index) => {
              return (
                <div>
                  {breadcrumb.name.length > 10
                    ? breadcrumb.name.substring(0, 10) + '...'
                    : breadcrumb.name}
                  /
                </div>
              );
            })}
        </div>
      </div>
      {templateList?.map((template) => {
        return (
          <div
            className={
              templateSelect == template.guid
                ? 'template-projects-item active'
                : 'template-projects-item'
            }
            data-id={template.guid}
            onClick={() =>
              next(
                template.idCompany,
                template.id,
                template.name,
                template.guid,
                template.baseCalculationGuid,
                template.isAllChats,
                template.idAccess,
              )
            }
            onDoubleClick={(e) => {
              if (templateSelect === '') {
                alert('Выберите вариант');
                return false;
              }
              if (currentVariant == null) {
                alert('Выберите вариант');
                return false;
              }
              clearTimeout(timer);
              setShow(true);
            }}>
            <div
              className="template-projects-item--img"
              style={{
                backgroundImage: `url(${
                  template.iconPath ? template.iconPath.replace(/ /gi, '%20') : defaultImg
                })`,
              }}></div>
            {template.isAccess && <div className="idAccess"></div>}
            <div className="template-projects-item--name">{template.name}</div>
            {template?.idOriginal && <div className="template-label"></div>}
          </div>
        );
      })}
      <AddingProjectTemplate show={show} close={handleClose} save={saveProject} />
    </div>
  );
}
