import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Network from './Requests';
import Users from './Users';
import AddingProjectTemplate from './AddingProjectTemplate';
import { setLoader } from '../store/reducers/preloaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFolderStore,
  setProductStore,
  setSourceStore,
  setPhone,
} from '../store/reducers/saveGuids';

const DescriptionProject = (props) => {
  const [openTemplate, setOpenTemplate] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [source, setSource] = React.useState([]);
  const [type, setType] = React.useState([]);
  const companyId = useSelector((state) => state.project.companyId);
  const calculationGuid = useSelector((state) => state?.variant?.current?.calculationGuid);
  const dispatch = useDispatch();

  const getData = async () => {
    if (Object.keys(props.current).length != 0) {
      let product = await new Network().GetProductTypes();
      let source = await new Network().GetSourceTypes();
      let sourceName = source?.find((item) => item.id == props.current.idSourceType);
      let productName = product?.find((item) => item.id == props.current.idProductType);
      setType(productName?.name);
      setSource(sourceName?.name);
    }
  };

  const getGroups = async () => {
    if (companyId != 'null' && companyId != undefined && props.current?.forDisplayTape == false) {
      let folders = await new Network().GetGroups(companyId, props.current.projectGuid);
      dispatch(setFolderStore(folders));
    }
  };

  useEffect(() => {
    getData();
    localStorage.setItem('phone', props?.current?.phoneNumber);
    dispatch(setPhone(props?.current?.phoneNumber));
  }, [props.current]);

  useEffect(() => {
    getGroups();
  }, [companyId, calculationGuid, props.current]);

  const chatCreatedDateField =
    props.current.requestDate != null
      ? 'Дата и время создания чата: ' +
        props.current.requestDate?.substring(0, 10) +
        ' ' +
        props.current.requestDate?.substring(11, 19)
      : null;

  const orderingDateField =
    props.current.orderDate != null
      ? 'Дата оформления заказа: ' + props.current.orderDate?.substring(0, 10)
      : null;
  const expirationDateField =
    props.current.expirationDate != null
      ? 'Срок выполнения заказа: ' + props.current.expirationDate?.substring(0, 10)
      : null;
  const completeDateField =
    props.current.orderCompletionDate != null
      ? 'Дата выполнения заказа: ' + props.current.orderCompletionDate?.substring(0, 10)
      : null;
  const archiveDateField =
    props.current.archivedDate != null
      ? 'Дата перемещения в архив: ' + props.current.archivedDate?.substring(0, 10)
      : null;

  const projectFields = [
    props.current.projectNameOriginal,
    props.current.orderNumber,
    props.current.address,
    props.current.customerFullName,
    props.current.phoneNumber,
    props.current.clientEmail,
    props.current.amoCRMLink,
    source,
    type,
    props.current.sum,
    chatCreatedDateField,
    orderingDateField,
    expirationDateField,
    completeDateField,
    archiveDateField,
    props.current.description,
    props.current.feedback,
    props.current.workCosts,
    props.current.materialCosts,
    props.current.costsNote,
    props.current.currentCRMGroup?.name,
  ];

  const numberOfItems = showMore ? projectFields.length : 4;

  const handleClose = () => {
    props.close();
    setActiveStep(0);
  };
  const handleShowMoreClick = () => {
    setShowMore(!showMore);
  };
  const handleOpenTemplate = () => {
    setActiveStep(1);
    // setOpenTemplate(true);
  };

  const back = () => {
    setActiveStep(0);
    // handleClose();
    setOpenTemplate(true);
  };

  const handleCloseTemplate = () => {
    setOpenTemplate(false);
  };

  const saveProject = (
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
    selectFolder,
  ) => {
    dispatch(setLoader(true));
    const send = new Network()
      .Update(
        props.current.projectGuid,
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
        selectFolder,
        companyId,
      )
      .then((result) => {
        props.onUpdateProject(result, props.current.projectGuid);
        setOpenTemplate(false);
        dispatch(setLoader(false));
      });
  };

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <div className="top-panel">
              <p onClick={handleClose} className="top-panel--close">
                Назад
              </p>
              <p onClick={handleOpenTemplate} className="top-panel--edit-name">
                Изменить
              </p>
            </div>
            <div className="pr-descr-title">
              <div
                className="pr-descr-photo"
                style={{
                  backgroundImage: `url("${props.current.projectSmallPicturePath}")`,
                }}></div>
              <div className="pr-descr-project-name pr-descr-project-name--info">
                {props.current.name?.slice(0, 350)}
              </div>
            </div>
            <div className="pr-descr-items">
              {projectFields.slice(0, numberOfItems).map((item) => {
                if (item != null && item != '') {
                  return <div className="pr-descr-item pr-descr-item--edit">{item}</div>;
                }
              })}
            </div>

            <div className="pr-users-info">
              <div
                className={'pr-descr-share pr-descr-share--info ' + (showMore ? 'active' : '')}
                onClick={() => handleShowMoreClick()}>
                Доп. параметры
              </div>
              <Users typeView="large" current={props.current} />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <AddingProjectTemplate
              current={props.current}
              show={true}
              close={handleCloseTemplate}
              save={saveProject}
              slice={true}
              back={back}
              step={activeStep}
              open={openTemplate}
            />
          </>
        );
      default:
        return 'Unknown stepIndex';
    }
  }

  return (
    <>
      {/* <div className="group">{getStepContent(activeStep)}</div> */}
      <Dialog open={props.show} keepMounted onClose={handleClose}>
        <DialogContent style={{ paddingLeft: 0, paddingRight: 0 }}>
          {getStepContent(activeStep)}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DescriptionProject;
