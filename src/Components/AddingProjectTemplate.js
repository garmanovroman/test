import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Network from './Requests';
import { setProductStore, setSourceStore } from '../store/reducers/saveGuids';

const AddingProjectTemplate = (props) => {
  const [name, setName] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [clientEmail, setClientEmail] = React.useState('');
  const [descr, setDescr] = React.useState('');
  const [amoLink, setAmoLink] = React.useState('');
  const [source, setSource] = React.useState([]);
  const [sourceSelect, setSourceSelect] = React.useState(0);
  const [productType, setProductType] = React.useState([]);
  const [productTypeSelect, setProductTypeSelect] = React.useState(0);
  const [sum, setSum] = React.useState('');
  const [term, setTerm] = React.useState('');
  const [requestDate, setRequestDate] = React.useState(
    new Date().toLocaleDateString() + ' ' + new Date().toTimeString().substring(0, 8),
  );
  const [completeDate, setCompleteDate] = React.useState('');
  const [orderingDate, setOrderingDate] = React.useState('');
  const [archiveDate, setArchiveDate] = React.useState('');
  const [feedback, setFeedback] = React.useState('');
  const [workCosts, setWorkCosts] = React.useState(0);
  const [materialCosts, setMaterialCosts] = React.useState(0);
  const [costsRemark, setCostsRemark] = React.useState('');
  const [folders, setFolders] = React.useState([]);
  const [folderSelect, setFolderSelect] = React.useState('');
  const dispatch = useDispatch();

  const [edit, setEdit] = React.useState(false);
  const [confirmForm, setConfirmForm] = React.useState(false);
  const saveVariant = useSelector((state) => state?.project?.saveVariant);
  let productStore = useSelector((state) => state?.guids?.product);
  let sourceStore = useSelector((state) => state?.guids?.source);
  let foldersStore = useSelector((state) => state?.guids.folders);

  const getData = async () => {
    let products = await new Network().GetProductTypes();
    let sources = await new Network().GetSourceTypes();
    setProductType(products);
    setSource(sources);
    setFolders(foldersStore);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (props.current != undefined) {
      setName(props.current.projectNameOriginal);
      setNumber(props.current.orderNumber);
      setAddress(props.current.address);
      setFullName(props.current.customerFullName);
      setPhone(props.current.phoneNumber);
      setClientEmail(props.current.clientEmail);
      setDescr(props.current.description);
      setAmoLink(props.current.amoCRMLink);
      props.current.idSourceType == null
        ? setSourceSelect(0)
        : setSourceSelect(props.current.idSourceType);
      props.current.idProductType == null
        ? setProductTypeSelect(0)
        : setProductTypeSelect(props.current.idProductType);
      setSum(props.current.sum);
      setRequestDate(
        props.current.requestDate?.substring(0, 10) +
          ' ' +
          props.current.requestDate?.substring(11, 19),
      );
      setOrderingDate(props.current.orderDate?.substring(0, 10));
      setTerm(props.current.expirationDate?.substring(0, 10));
      setCompleteDate(props.current.orderCompletionDate?.substring(0, 10));
      setArchiveDate(props.current.archivedDate?.substring(0, 10));
      setFeedback(props.current.feedback);
      setWorkCosts(props.current.workCosts);
      setMaterialCosts(props.current.materialCosts);
      setCostsRemark(props.current.costsNote);
      setFolderSelect(props.current.currentCRMGroup?.guid);
    }
  }, [props.current]);

  const handlerChangeName = (e) => {
    setName(e);
  };

  const handlerChangeNumber = (e) => {
    setNumber(e);
  };

  const handlerChangeAddress = (e) => {
    setAddress(e);
  };

  const handlerChangeFullName = (e) => {
    setFullName(e);
  };

  const handlerChangePhone = (e) => {
    setPhone(e);
  };

  const handlerChangeDescr = (e) => {
    setDescr(e);
  };

  const handlerChangeAmoLink = (e) => {
    setAmoLink(e);
  };

  // const handlerChangeSource = (e) => {
  //   setSource(e);
  // };

  // const handlerChangeProductType = (e) => {
  //   setProductType(e);
  // };

  const handlerChangeSum = (e) => {
    setSum(e);
  };

  const handlerChangeTerm = (e) => {
    setTerm(e);
  };

  const handlerChangeRequestDate = (e) => {
    setRequestDate(e);
  };

  const handlerChangeFeedback = (e) => {
    setFeedback(e);
  };

  const handlerChangeCompleteDate = (e) => {
    setCompleteDate(e);
  };

  const handlerChangeArchiveDate = (e) => {
    setArchiveDate(e);
  };

  const handlerChangeOrderingDate = (e) => {
    setOrderingDate(e);
  };

  const handlerChangeEmail = (e) => {
    setClientEmail(e);
  };

  const handlerChangeWorkCost = (e) => {
    setWorkCosts(e);
  };

  const handlerChangeMaterialCost = (e) => {
    setMaterialCosts(e);
  };

  const handlerChangeCostsRemark = (e) => {
    setCostsRemark(e);
  };

  const cleanUp = () => {
    setName('');
    setNumber('');
    setAddress('');
    setFullName('');
    setPhone('');
    setClientEmail('');
    setAmoLink('');
    setProductTypeSelect(0);
    setSourceSelect(0);
    // setSource([]);
    // setProductType([]);
    setSum('');
    setRequestDate(
      new Date().toLocaleDateString() + ' ' + new Date().toTimeString().substring(0, 8),
    );
    setOrderingDate('');
    setTerm('');
    setCompleteDate('');
    setArchiveDate('');
    setFeedback('');
    setDescr('');
    setWorkCosts(0);
    setMaterialCosts(0);
    setCostsRemark('');
  };

  const saveProject = () => {
    props.save(
      name,
      number,
      address,
      fullName,
      phone,
      clientEmail,
      amoLink,
      sourceSelect,
      productTypeSelect,
      sum,
      requestDate,
      orderingDate,
      term,
      completeDate,
      archiveDate,
      feedback,
      descr,
      workCosts,
      materialCosts,
      costsRemark,
      folderSelect,
    );
    setEdit(true);
    props.current != undefined ? handleBack() : handleCloseProject();
  };

  const handleCloseProject = () => {
    cleanUp();
    props.close();
  };
  const handleClose = () => {
    setConfirmForm(true);
  };

  const сhangeSource = (event) => {
    setSourceSelect(event.target.value);
  };

  const сhangeProduct = (event) => {
    setProductTypeSelect(event.target.value);
  };

  const changeStatus = (event) => {
    setFolderSelect(event.target.value);
  };

  const setInitialState = () => {
    if (props.current != undefined && edit == false) {
      setName(props.current.projectNameOriginal);
      setNumber(props.current.orderNumber);
      setAddress(props.current.address);
      setFullName(props.current.customerFullName);
      setPhone(props.current.phoneNumber);
      setClientEmail(props.current.clientEmail);
      setDescr(props.current.description);
      setAmoLink(props.current.amoCRMLink);
      setSourceSelect(props.current.idSourceType);
      setProductTypeSelect(props.current.idProductType);
      setSum(props.current.sum);
      setRequestDate(
        props.current.requestDate?.substring(0, 10) +
          ' ' +
          props.current.requestDate?.substring(11, 19),
      );
      setOrderingDate(props.current.orderDate?.substring(0, 10));
      setTerm(props.current.expirationDate?.substring(0, 10));
      setCompleteDate(props.current.orderCompletionDate?.substring(0, 10));
      setArchiveDate(props.current.archivedDate?.substring(0, 10));
      setFeedback(props.current.feedback);
      setWorkCosts(props.current.workCosts);
      setMaterialCosts(props.current.materialCosts);
      setCostsRemark(props.current.costsNote);
      setFolderSelect(props.current.currentCRMGroup.guid);
    }
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleBack = () => {
    props.back();
  };

  const projectNotSave = () => {
    setConfirmForm(false);
    props.close();
    cleanUp();
  };

  const projectSave = () => {
    setConfirmForm(false);
    saveProject();
    cleanUp();
    props.close();
  };

  return (
    <>
      <Dialog
        open={confirmForm}
        onClose={() => {
          setConfirmForm(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы хотите сохранить проект?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={projectSave} color="primary">
            Да
          </Button>
          <Button onClick={projectNotSave} color="primary">
            Нет
          </Button>
        </DialogActions>
      </Dialog>
      {props.slice == true ? (
        <>
          <div className="top-panel">
            <p onClick={handleBack} className="top-panel--close">
              Назад
            </p>
          </div>
          <div className="slice-temp">
            <div class="infoList--title">
              {saveVariant ? 'Имя варианта' : 'Информация о проекте'}
            </div>
            <div className="templates">
              {saveVariant ? (
                <input
                  type="text"
                  placeholder="Название варианта"
                  value={name}
                  onChange={(e) => handlerChangeName(e.target.value)}
                />
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Номер заказа"
                    value={number}
                    onChange={(e) => handlerChangeNumber(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Название проекта"
                    value={name}
                    onChange={(e) => handlerChangeName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Адрес"
                    value={address}
                    onChange={(e) => handlerChangeAddress(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="ФИО"
                    value={fullName}
                    onChange={(e) => handlerChangeFullName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Телефон"
                    value={phone}
                    onChange={(e) => handlerChangePhone(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Email"
                    value={clientEmail}
                    onChange={(e) => handlerChangeEmail(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="АМО"
                    value={amoLink}
                    onChange={(e) => handlerChangeAmoLink(e.target.value)}
                  />
                  <FormControl className="select-form">
                    <InputLabel id="demo-simple-select-label">Источник</InputLabel>
                    <Select
                      value={sourceSelect}
                      onChange={сhangeSource}
                      label="Источник"
                      className="select-label"
                      MenuProps={MenuProps}>
                      <MenuItem value={0}>Источник</MenuItem>
                      {source?.map((c) => {
                        return <MenuItem value={c.id}>{c.name}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                  <FormControl className="select-form">
                    <InputLabel id="demo-simple-select-label">Тип продукта</InputLabel>
                    <Select
                      value={productTypeSelect}
                      onChange={сhangeProduct}
                      label="Тип продукта"
                      className="select-label"
                      MenuProps={MenuProps}>
                      <MenuItem value={0}>Тип продукта</MenuItem>
                      {productType?.map((c) => {
                        return <MenuItem value={c.id}>{c.name}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                  <input
                    type="text"
                    placeholder="Сумма"
                    value={sum}
                    onChange={(e) => handlerChangeSum(e.target.value)}
                  />
                  <TextField
                    id="date"
                    label="Дата (и время) создания чата"
                    type="text"
                    disabled={true}
                    fullWidth="true"
                    className="dataTimer dataTimer--pad1"
                    value={requestDate}
                  />
                  <TextField
                    id="date"
                    label="Дата оформления заказа"
                    type="date"
                    fullWidth="true"
                    className="dataTimer dataTimer--pad"
                    value={orderingDate}
                    onChange={(e) => handlerChangeOrderingDate(e.target.value)}
                  />
                  <TextField
                    id="date"
                    label="Срок выполнения заказа"
                    type="date"
                    fullWidth="true"
                    className="dataTimer dataTimer--pad"
                    value={term}
                    onChange={(e) => handlerChangeTerm(e.target.value)}
                  />
                  <TextField
                    id="date"
                    label="Дата выполнения заказа"
                    type="date"
                    fullWidth="true"
                    className="dataTimer dataTimer--pad"
                    value={completeDate}
                    onChange={(e) => handlerChangeCompleteDate(e.target.value)}
                  />
                  <TextField
                    id="date"
                    label="Дата перемещения в архив"
                    type="date"
                    fullWidth="true"
                    className="dataTimer dataTimer--pad2"
                    value={archiveDate}
                    onChange={(e) => handlerChangeArchiveDate(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Описание проекта"
                    value={descr}
                    onChange={(e) => handlerChangeDescr(e.target.value)}
                  />
                  <textarea
                    style={{ marginBottom: 10 }}
                    placeholder="Обратная связь"
                    value={feedback}
                    onChange={(e) => handlerChangeFeedback(e.target.value)}></textarea>
                  <TextField
                    id="standard-number"
                    label="Затраты: работа"
                    type="number"
                    fullWidth="true"
                    className="numberInput"
                    value={workCosts}
                    onChange={(e) => handlerChangeWorkCost(e.target.value)}
                  />
                  <TextField
                    id="standard-number"
                    label="Затраты: материал"
                    type="number"
                    fullWidth="true"
                    className="numberInput numberInput--pad"
                    value={materialCosts}
                    onChange={(e) => handlerChangeMaterialCost(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Примечание к затратам"
                    value={costsRemark}
                    onChange={(e) => handlerChangeCostsRemark(e.target.value)}
                  />
                  <FormControl className="select-form">
                    <InputLabel id="demo-simple-select-label">Статус</InputLabel>
                    <Select
                      value={folderSelect}
                      onChange={changeStatus}
                      label="Статус"
                      className="select-label"
                      MenuProps={MenuProps}>
                      <MenuItem value={props.current?.currentCRMGroup?.guid}>
                        {props.current?.currentCRMGroup?.name}
                      </MenuItem>
                      {folders?.map((c) => {
                        return <MenuItem value={c.guid}>{c.name}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </>
              )}
              <div className="share-cancel button" onClick={saveProject}>
                Сохранить
              </div>
            </div>
          </div>
        </>
      ) : (
        <Dialog
          open={props.show}
          keepMounted
          onClose={handleClose}
          TransitionProps={{ onEnter: setInitialState }}>
          <DialogContent>
            <div class="infoList--title">
              {saveVariant ? 'Имя варианта' : 'Информация о проекте'}
            </div>
            <div className="templates">
              {saveVariant ? (
                <input
                  type="text"
                  placeholder="Название варианта"
                  value={name}
                  onChange={(e) => handlerChangeName(e.target.value)}
                />
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Номер заказа"
                    value={number}
                    onChange={(e) => handlerChangeNumber(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Название проекта"
                    value={name}
                    onChange={(e) => handlerChangeName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Адрес"
                    value={address}
                    onChange={(e) => handlerChangeAddress(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="ФИО"
                    value={fullName}
                    onChange={(e) => handlerChangeFullName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Телефон"
                    value={phone}
                    onChange={(e) => handlerChangePhone(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Email"
                    value={clientEmail}
                    onChange={(e) => handlerChangeEmail(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="АМО"
                    value={amoLink}
                    onChange={(e) => handlerChangeAmoLink(e.target.value)}
                  />
                  <FormControl className="select-form">
                    <InputLabel id="demo-simple-select-label">Источник</InputLabel>
                    <Select
                      value={sourceSelect}
                      onChange={сhangeSource}
                      label="Источник"
                      className="select-label"
                      MenuProps={MenuProps}>
                      <MenuItem value={0}>Источник</MenuItem>
                      {source?.map((c) => {
                        return <MenuItem value={c.id}>{c.name}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                  <FormControl className="select-form">
                    <InputLabel id="demo-simple-select-label">Тип продукта</InputLabel>
                    <Select
                      value={productTypeSelect}
                      onChange={сhangeProduct}
                      label="Тип продукта"
                      className="select-label"
                      MenuProps={MenuProps}>
                      <MenuItem value={0}>Тип продукта</MenuItem>
                      {productType?.map((c) => {
                        return <MenuItem value={c.id}>{c.name}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                  <input
                    type="text"
                    placeholder="Сумма"
                    value={sum}
                    onChange={(e) => handlerChangeSum(e.target.value)}
                  />
                  <TextField
                    id="date"
                    label="Дата (и время) создания чата"
                    type="text"
                    disabled={true}
                    fullWidth="true"
                    className="dataTimer dataTimer--pad1"
                    value={requestDate}
                  />
                  <TextField
                    id="date"
                    label="Дата оформления заказа"
                    type="date"
                    fullWidth="true"
                    className="dataTimer dataTimer--pad"
                    value={orderingDate}
                    onChange={(e) => handlerChangeOrderingDate(e.target.value)}
                  />
                  <TextField
                    id="date"
                    label="Срок выполнения заказа"
                    type="date"
                    fullWidth="true"
                    className="dataTimer dataTimer--pad"
                    value={term}
                    onChange={(e) => handlerChangeTerm(e.target.value)}
                  />
                  <TextField
                    id="date"
                    label="Дата выполнения заказа"
                    type="date"
                    fullWidth="true"
                    className="dataTimer dataTimer--pad"
                    value={completeDate}
                    onChange={(e) => handlerChangeCompleteDate(e.target.value)}
                  />
                  <TextField
                    id="date"
                    label="Дата перемещения в архив"
                    type="date"
                    fullWidth="true"
                    className="dataTimer dataTimer--pad2"
                    value={archiveDate}
                    onChange={(e) => handlerChangeArchiveDate(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Описание проекта"
                    value={descr}
                    onChange={(e) => handlerChangeDescr(e.target.value)}
                  />
                  <textarea
                    placeholder="Обратная связь"
                    style={{ marginBottom: 10 }}
                    value={feedback}
                    onChange={(e) => handlerChangeFeedback(e.target.value)}></textarea>
                  <TextField
                    id="standard-number"
                    label="Затраты: работа"
                    type="number"
                    fullWidth="true"
                    className="numberInput"
                    onChange={(e) => handlerChangeWorkCost(e.target.value)}
                  />
                  <TextField
                    id="standard-number"
                    label="Затраты: материал"
                    type="number"
                    fullWidth="true"
                    className="numberInput numberInput--pad"
                    onChange={(e) => handlerChangeMaterialCost(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Примечание к затратам"
                    value={costsRemark}
                    onChange={(e) => handlerChangeCostsRemark(e.target.value)}
                  />
                </>
              )}
              <div className="share-cancel button" onClick={saveProject}>
                Сохранить
              </div>
              <div className="share-cancel button" onClick={handleClose}>
                Отменить
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
export default AddingProjectTemplate;
