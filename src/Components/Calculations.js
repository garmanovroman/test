import React from 'react';
import Network from './Requests';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearList,
  removeBreadcrumbs,
  setSaveVariant,
  templateOpenStatus,
  setCompany,
  setIdAccess,
  setParentStructureId,
  setTemplateSelection,
} from '../store/reducers/projectSlice';
import { setDisplayType, setCurrent, setLockImg } from '../store/reducers/variantSlice';
import { setLoader } from '../store/reducers/preloaderSlice';
import AddingProjectTemplate from './AddingProjectTemplate';
import {} from '../store/reducers/saveGuids';

export default function Calculations(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const breadcrumbsList = useSelector((state) => state.project.breadcrumbs);
  const currentVariantGuid = useSelector((state) => state.variant.current.calculationGuid);
  const onAddDisplayType = useSelector((state) => state.variant.addDisplayType);
  const companyId = useSelector((state) => state.project.companyId);
  const projectUnite = useSelector((state) => state.project.list);
  const statusOpen = useSelector((state) => state.project.templateStatusOpen);
  const templateList = useSelector((state) => state.project.templateList);
  const projectGuid = useSelector((state) => state?.guids?.project);
  const variant = useSelector((state) => state.variant.list);

  const handleClick = () => {
    var el = document.getElementById('project-content');
    setProjectTemplatePosition(el);
    el.setAttribute('class', 'openTemplate');
    dispatch(templateOpenStatus(true));
    props.changeCatalog(true);
  };

  const setProjectTemplatePosition = (el) => {
    var templateList = document.getElementsByClassName('template-projects');
    templateList[0].style.top = el.scrollTop + 'px';
  };

  const handleClickVariant = async (event) => {
    if (!onAddDisplayType) {
      props.openTemplate();
    }
    var el = document.getElementById('project-content');
    setProjectTemplatePosition(el);
    el.setAttribute('class', 'openTemplate');
    dispatch(templateOpenStatus(true));
    dispatch(setSaveVariant(true));
    props.changeCatalog(true);
  };

  const handleClickClose = (event) => {
    var el = document.getElementById('project-content');
    el.setAttribute('class', 'project-content');
    props.changeCatalog(false, currentVariantGuid);
    if (projectUnite.length > 0) {
      setAnchorEl(event.currentTarget);
    } else {
      dispatch(setIdAccess(null));
      dispatch(setTemplateSelection(''));
      dispatch(setParentStructureId(null));
      dispatch(templateOpenStatus(false));
      dispatch(setSaveVariant(false));
      dispatch(setLockImg(false));
      if (breadcrumbsList.length > 1) {
        dispatch(removeBreadcrumbs());
      }
    }
  };

  const handleClose = () => {
    var el = document.getElementById('project-content');
    el.classList.remove('openTemplate');
    el.classList.add('project-content');
    props.changeCatalog(false);
    setAnchorEl(null);
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
    dispatch(setLoader(true));
    const send = await new Network().CreateProjectFromDisplayTapes(
      projectUnite,
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
      new Date(requestDate),
      new Date(orderDate),
      new Date(expirationDate),
      new Date(orderCompletionDate),
      new Date(archivedDate),
      feedback,
      descr,
      workCosts,
      materialCosts,
      costsNote,
      companyId,
    );

    let data = JSON.parse(send);
    const newUsers = await new Network().getUsersProject(data.projectGuid);
    data.users = newUsers;
    props.onAddProject(data, true, false, null, projectUnite);
    dispatch(setLoader(false));
    dispatch(clearList());
    let com = companyId;
    dispatch(setCompany(com));
    setAnchorEl(null);
    var cusid_ele = document.getElementsByClassName('projects');
    cusid_ele[0].classList.toggle('active');
    var cusid_ele = document.getElementsByClassName('open-project');
    cusid_ele[0].classList.toggle('active');
  };

  const handlerClickAdd = async (event) => {
    if (onAddDisplayType) {
      dispatch(setLoader(true));
      const send = await new Network().AddVariantsFromDisplayTapes(projectUnite, projectGuid);
      dispatch(clearList());
      let com = companyId;
      dispatch(setCompany(com));
      dispatch(setDisplayType(false));
      var cusid_ele = document.getElementsByClassName('projects');
      cusid_ele[0].classList.toggle('active');
      var cusid_ele = document.getElementsByClassName('open-project');
      cusid_ele[0].classList.toggle('active');
      dispatch(setLoader(false));
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  return (
    <>
      {companyId > 0 &&
        (props.variant == 'true' ? (
          props.displayTape == false &&
          (statusOpen == false ? (
            <a className="open-btn open-btn--var" onClick={handleClickVariant}></a>
          ) : (
            <a className="open-btn open-btn--var close" onClick={handleClickClose}></a>
          ))
        ) : projectUnite.length > 0 ? (
          <div className="add-variant" onClick={handlerClickAdd}>
            Добавить
          </div>
        ) : statusOpen == false ? (
          <a className="open-btn" onClick={handleClick}></a>
        ) : (
          <a className="open-btn close" onClick={handleClickClose}></a>
        ))}

      <AddingProjectTemplate show={open} close={handleClose} save={saveProject} />
    </>
  );
}
