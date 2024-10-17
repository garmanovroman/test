import React, { useEffect, useState, useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useSelector, useDispatch } from 'react-redux';
import { setOpenPublicForm, setCloseActionPanel } from '../../store/reducers/saveGuids';
import QRCode from 'qrcode.react';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Network from '../Requests';
import { globalConfig } from '../../configuration/config';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { setGroupsStore } from '../../store/reducers/saveGuids';
import { insert } from 'formik';
import { clear, setLink, setList, setPhone } from '../../store/reducers/linkSlice';
import { TreeSelect } from 'primereact/treeselect';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import ChangeModel from './ChangeModel';
import { setOpen } from '../../store/reducers/changeModelSlice';
import { setOpenAnalytics } from '../../store/reducers/analyticsSlice';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  menuPaper: {
    maxHeight: 200,
  },
});

const PublicLink = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const changeLink = useSelector((state) => state.changeModel?.current);
  const infoLink = useSelector((state) => state.link?.info);
  const phoneOpen = useSelector((state) => state.link?.phone);
  const [nodes, setNodes] = useState(null);
  const [selectedNodeKey, setSelectedNodeKey] = useState(null);
  const [users, setUsers] = React.useState();
  const guidUserCurrent = useSelector((state) => state.users?.currentUser?.guid);
  const [user, setUser] = React.useState(guidUserCurrent);
  const [catalog, setCatalog] = React.useState(
    infoLink?.idStartCatalogFolder?.length > 0 ? infoLink?.idStartCatalogFolder : '',
  );
  const [orderingDate, setOrderingDate] = React.useState();
  const [term, setTerm] = React.useState(infoLink?.activeTo);
  const [phone, setPhone] = React.useState('4992167212');
  const [address, setAddress] = React.useState('https://interior-techno.ru/#order');
  const [nameCalculation, setNameCalculation] = React.useState('');
  const [guidLink, setGuidLink] = React.useState(
    infoLink?.publicLinkUrl?.length > 0 ? infoLink?.publicLinkUrl : '',
  );
  const [ShowSaveVariantButton, setShowSaveVariantButton] = React.useState(false);
  const [ShowPrice, setShowPrice] = React.useState(false);
  const open = useSelector((state) => state.guids.openPublicForm);
  const calculationList = useSelector((state) => state.variant?.list);

  const calculationGuid = useSelector((state) => state.variant?.current?.calculationGuid);
  const currentIconPath = useSelector((state) => state.variant?.current?.iconPath);
  const groups = useSelector((state) => state.guids?.groups);
  const variantList = useSelector((state) => state.variant?.list);
  const variantCurrent = useSelector((state) => state.variant?.current);
  const projectGuid = useSelector((state) => state.variant?.current?.projectGuid);
  const companyId = useSelector((state) => state.project.companyId);
  const listLink = useSelector((state) => state?.link?.list);
  const hidden = useRef(null);

  const [select, setSelect] = useState('Chat');
  const [typeThree, setTypeThree] = useState('1');
  const [link, setLink] = useState('');
  const [links, setLinks] = useState();
  const [folder, setFolder] = useState();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [checked, setChecked] = React.useState(false);

  const [errorOpen, setErrorOpen] = useState(false);
  const [message, setMessage] = useState('');

  const [channel, setChannel] = React.useState(infoLink?.salesChanel ? infoLink?.salesChanel : 1);

  const [place, setPlace] = React.useState(
    infoLink?.guidDestinationGroup?.length > 0 ? infoLink?.guidDestinationGroup : '',
  );

  const [placeSave, setPlaceSave] = React.useState(
    infoLink?.guidDestinationGroupAfterSaveVariant?.length > 0
      ? infoLink?.guidDestinationGroupAfterSaveVariant
      : '',
  );

  const [types, setTypes] = React.useState(
    Number.isInteger(infoLink?.varietyType) ? infoLink?.varietyType : '',
  );
  const [state, setState] = React.useState({
    save: false,
    price: false,
  });

  const handleChangeCheck = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleChangeChecked = (event) => {
    setChecked(event.target.checked);
  };

  const handleChangeType = (event) => {
    setTypeThree(event.target.value);
  };

  const handleChange = (event) => {
    setSelect(event.target.value);
  };

  const copyLink = (e) => {
    var copyText = document.getElementById('copyLink');
    window.navigator.clipboard.writeText(copyText.value);
    var tooltip = document.getElementById('TooltipText');
    tooltip.innerHTML = 'Скопировано';
  };

  const outFunc = (e) => {
    var tooltip = document.getElementById('TooltipText');
    tooltip.innerHTML = 'Копировать';
  };

  const currentVariantIndex = () => {
    var a;
    if (calculationList) {
      var a = calculationList.findIndex((i) => i.calculationGuid == calculationGuid);
    }

    if (a != -1) {
      return a + 1;
    }
  };
  const getEditData = ({
    listData,
    renameKeys,
    options = { renameRecursionByKey: '', fields: {} },
  }) => {
    const copyListData = JSON.parse(JSON.stringify(listData));
    const recursion = (items) => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        for (let j = 0; j < renameKeys.length; j++) {
          const [oldKey, newKey] = renameKeys[j];

          if (oldKey in items[i]) {
            const value = items[i][oldKey];
            delete items[i][oldKey];
            items[i][newKey] = value;
          }
        }

        items[i] = { ...items[i], ...options.fields };
        if (options.renameRecursionByKey in item && item[options.renameRecursionByKey].length) {
          recursion(item[options.renameRecursionByKey]);
        }
      }
    };
    recursion(copyListData);
    return copyListData;
  };

  useEffect(() => {
    const fetch = async () => {
      let result = [];
      const a = await new Network().GetActiveCompanyUsers(companyId);
      const catalog = await new Network().GetCatalogFoldersTree(companyId);
      const newData = getEditData({
        listData: catalog,
        renameKeys: [
          ['folderId', 'key'],
          ['name', 'label'],
          ['childs', 'children'],
        ],
        options: {
          renameRecursionByKey: 'children',
        },
      });
      setUsers(a);
      setCatalog(newData);
      setUser(guidUserCurrent);
    };
    if (companyId !== 'null' && companyId !== undefined) {
      fetch();
    }
  }, [companyId]);

  useEffect(() => {
    // getLink();
  }, [select, calculationGuid, open, types]);

  useEffect(() => {
    if (
      (types == 3 && infoLink?.publicLinkUrl?.length == undefined) ||
      (types == 4 && infoLink?.publicLinkUrl?.length == undefined)
    ) {
      setPlace('a14d3ce1-2d60-497f-847c-0990b52715a5');
    } else if (
      (types == 1 && infoLink?.publicLinkUrl?.length == undefined) ||
      (types == 2 && infoLink?.publicLinkUrl?.length == undefined)
    ) {
      setPlaceSave('a14d3ce1-2d60-497f-847c-0990b52715a5');
      setPlace('99d875b2-c4f1-4634-aa7e-ba5b26c7d0c9');
    }
  }, [types]);

  useEffect(() => {
    let br;
    let dateStart;
    let dateEnd;
    const addZero = (number) => String(number).padStart(2, '0');
    const formatDate = (date) =>
      `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())}`;

    if (infoLink?.activeFrom?.length > 0 && infoLink?.publicLinkUrl?.length > 0) {
      let date = new Date(infoLink?.activeFrom);
      let day = String(date.getDate());
      let month = String(date.getMonth() + 1);
      if (day?.length == 2) {
        day = day;
      } else {
        day = '0' + day;
      }

      if (month?.length == 2) {
        month = month;
      } else {
        month = '0' + month;
      }

      let year = date.getFullYear();
      dateStart = year + '-' + month + '-' + day;
    } else {
      if (infoLink?.publicLinkUrl?.length > 0 && infoLink?.activeFrom != null) {
        dateStart = formatDate(new Date());
      }
    }

    if (infoLink?.activeTo?.length > 0 && infoLink?.publicLinkUrl?.length > 0) {
      let date = new Date(infoLink?.activeTo);
      let day = String(date.getDate());
      let month = String(date.getMonth() + 1);
      if (day?.length == 2) {
        day = day;
      } else {
        day = '0' + day;
      }

      if (month?.length == 2) {
        month = month;
      } else {
        month = '0' + month;
      }
      let year = date.getFullYear();
      dateEnd = year + '-' + month + '-' + day;
    } else {
      if (infoLink?.publicLinkUrl?.length > 0 && infoLink?.activeTo != null) {
        let date = new Date();
        let day = String(date.getDate() + 1);
        let month = String(date.getMonth() + 1);

        if (day?.length == 2) {
          day = day;
        } else {
          day = '0' + day;
        }

        if (month?.length == 2) {
          month = month;
        } else {
          month = '0' + month;
        }

        let year = date.getFullYear();
        dateEnd = year + '-' + month + '-' + day;
      }
    }

    setOrderingDate(dateStart);
    setTerm(dateEnd);

    if (Number.isInteger(infoLink?.varietyType)) {
      setTypes(infoLink?.varietyType);
    }
    if (infoLink?.feedbackFormUrl?.length > 0) {
      setAddress(infoLink?.feedbackFormUrl);
    }
    if (Number.isInteger(infoLink?.idStartCatalogFolder)) {
      setSelectedNodeKey(infoLink?.idStartCatalogFolder);
    }
    if (infoLink?.companyPhoneNumber?.length > 0) {
      setPhone(infoLink?.companyPhoneNumber);
    }
    if (infoLink?.companyUsers?.[0]?.userGuid?.length > 0) {
      setUser(infoLink?.companyUsers[0]?.userGuid);
    }
    if (infoLink?.guidDestinationGroup?.length > 0) {
      setPlace(infoLink?.guidDestinationGroup);
    }
    if (infoLink?.guidDestinationGroupAfterSaveVariant?.length > 0) {
      setPlaceSave(infoLink?.guidDestinationGroupAfterSaveVariant);
    }
    if (infoLink?.publicLinkUrl?.length > 0) {
      setGuidLink(infoLink?.publicLinkUrl);
    }

    if (infoLink?.publicLinkUrl?.length > 0) {
      setGuidLink(infoLink?.publicLinkUrl);
    }

    if (infoLink?.type) {
      setSelect(typeAr[infoLink?.type]);
    }

    if (infoLink?.startup3DType) {
      setTypeThree(String(infoLink?.startup3DType));
    }

    if (infoLink?.showSaveVariantButton) {
      setState((prev) => ({ ...prev, save: true }));
    }

    if (infoLink?.showPrice) {
      setState((prev) => ({ ...prev, price: true }));
    }
  }, [infoLink]);

  let typeAr = {
    1: 'Chat',
    4: '3D',
  };

  let typeThrees = {
    2: 'Vroom',
    1: 'Vroomplus',
  };

  useEffect(() => {
    if (infoLink?.publicLinkUrl?.length > 0) {
      const insert = `${globalConfig.config.common.chat}/web/public/?id=${infoLink?.publicLinkUrl}`;
      setLink(insert);
    }
  }, [infoLink]);

  const updateLink = () => {
    const update = async () => {
      let dateStart;
      let dateEnd;

      if (orderingDate?.length > 0) {
        dateStart = new Date(orderingDate).toISOString();
      } else {
        dateStart = null;
      }
      if (term?.length > 0) {
        dateEnd = new Date(term).toISOString();
      } else {
        dateEnd = null;
      }

      let userin = [
        {
          userGuid: user,
          companyId: companyId,
        },
      ];

      const link = await new Network().UpdatePublicLink(
        select,
        dateStart,
        dateEnd,
        channel,
        types,
        infoLink?.publicLinkUrl,
        changeLink?.calculationGuid?.length > 0 ? changeLink?.calculationGuid : calculationGuid,
        changeLink?.projectGuid?.length > 0 ? changeLink?.projectGuid : projectGuid,
        companyId,
        place,
        phone,
        selectedNodeKey,
        userin,
        address,
        state?.save,
        state?.price,
        Number(typeThree),
        placeSave,
      );

      let linkUpdate = listLink.map((item) => {
        if (item.publicLinkUrl == infoLink?.publicLinkUrl) {
          return {
            ...item,
            type: select,
            activeFrom: dateStart,
            activeTo: dateEnd,
            salesChannel: channel,
            varietyType: types,
          };
        } else {
          return item;
        }
      });
      if (link?.status == 'error') {
        setErrorOpen(true);
        setMessage(link?.text);
      } else {
        dispatch(setList(linkUpdate));
        dispatch(clear());
        dispatch(setOpenPublicForm(!open));
        updateLinks();
      }
    };
    update();
  };

  const getCode = () => {
    const getLink = async () => {
      if (types == 2) {
        let dateStart;
        let dateEnd;
        if (orderingDate?.length > 0) {
          dateStart = new Date(orderingDate).toISOString();
        }
        if (term?.length > 0) {
          dateEnd = new Date(term).toISOString();
        }
        let userin = [
          {
            userGuid: user,
            companyId: companyId,
          },
        ];
        const link = await new Network().GetPublicLink(
          select,
          dateStart,
          dateEnd,
          channel,
          types,
          calculationGuid,
          projectGuid,
          companyId,
          place,
          phone,
          selectedNodeKey,
          userin,
          address,
          state?.save,
          state?.price,
          Number(typeThree),
          placeSave,
        );
        if (link?.status == 'error') {
          setErrorOpen(true);
          setMessage(link?.text);
        } else {
          setGuidLink(link);
        }
      }
    };

    getLink();
  };

  const openQR = () => {
    if (!hidden) {
      return;
    }
    const getLink = async () => {
      let dateStart;
      let dateEnd;
      if (orderingDate?.length > 0) {
        dateStart = new Date(orderingDate).toISOString();
      }
      if (term?.length > 0) {
        dateEnd = new Date(term).toISOString();
      }
      let userin = [
        {
          userGuid: user,
          companyId: companyId,
        },
      ];
      const link = await new Network().GetPublicLink(
        select,
        dateStart,
        dateEnd,
        channel,
        types,
        calculationGuid,
        projectGuid,
        companyId,
        place,
        phone,
        selectedNodeKey,
        userin,
        address,
        state?.save,
        state?.price,
        Number(typeThree),
        placeSave,
      );
      if (link?.status == 'error') {
        setErrorOpen(true);
        setMessage(link?.text);
      } else {
        const insert = `${globalConfig.config.common.chat}/web/public/?id=${link}`;
        setLink(insert);
        hidden.current.classList.add('qr-view--display-view');
      }
    };

    getLink();
  };

  const salesChannelType = ['Сайт', 'Торговый зал', 'Каталог', 'рассылка'];

  const type = ['QR - код', 'Виджет', 'Телефон', 'Обратный звонок'];

  const changePage = (event, value) => {
    setPage(value);
  };

  const handlerChangeOrderingDate = (e) => {
    setOrderingDate(e);
  };

  const handlerChangeTerm = (e) => {
    setTerm(e);
  };

  const changeType = (event) => {
    setTypes(event.target.value);
  };

  const changePlace = (event) => {
    setPlace(event.target.value);
  };

  const changeModelOpen = () => {
    dispatch(setOpen(true));
  };

  const changePlaceSave = (event) => {
    setPlaceSave(event.target.value);
  };

  const changeChannel = (event) => {
    setChannel(event.target.value);
  };

  const updateLinks = () => {
    const fetch = async () => {
      const send = await new Network().GetPublicLinks(companyId, 1, 50);
      dispatch(setList(send?.data));
    };
    fetch();
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const handleClose = () => {
    dispatch(clear());
    setErrorOpen(false);
  };

  const deleteLink = (guid) => {
    const fetch = async () => {
      await new Network().DeletePublicLink(infoLink?.publicLinkUrl);
      dispatch(clear());
      dispatch(setOpenPublicForm(!open));
      updateLinks();
    };
    fetch();
  };

  const accept = () => {
    deleteLink();
  };

  const reject = () => {};

  const confirm = () => {
    confirmDialog({
      message: 'Вы точно хотите удалить ссылку?',
      header: 'Удаление ссылки',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      rejectLabel: 'Нет',
      acceptLabel: 'Да',
      accept,
      reject,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(setOpenPublicForm(!open));
        updateLinks();
        dispatch(clear());
      }}>
      <DialogContent className="public-link">
        <ChangeModel />
        <ConfirmDialog />
        <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {message}
          </Alert>
        </Snackbar>
        <div className="share">
          <div className="form--row form--row--left">
            <div className="links">
              <button type="text" className="" onClick={() => dispatch(setOpenAnalytics(true))}>
                Аналитика
              </button>
              <div className="flex between">
                <span>Рекламная ссылка</span>
              </div>
              <div className="flex">
                <TextField
                  id="date"
                  label="C"
                  type="date"
                  fullWidth="true"
                  className="dataTimer dataTimer--pad"
                  value={orderingDate}
                  onChange={(e) => handlerChangeOrderingDate(e.target.value)}
                />
                <TextField
                  id="date"
                  label="по"
                  type="date"
                  fullWidth="true"
                  className="dataTimer dataTimer--pad"
                  value={term}
                  onChange={(e) => handlerChangeTerm(e.target.value)}
                />
              </div>
              <div className="flex">
                <div
                  className="back-img"
                  style={{
                    backgroundImage: `url("${
                      infoLink?.iconPath?.length > 0
                        ? changeLink?.iconPath?.length > 0
                          ? changeLink?.iconPath
                          : infoLink?.iconPath
                        : variantCurrent !== null && variantCurrent?.mainIconPath
                    }`,
                  }}></div>
                <div className="info">
                  <div className="name">
                    {infoLink?.calculationName
                      ? changeLink?.calculationName?.length > 0
                        ? changeLink?.calculationName
                        : infoLink?.calculationName
                      : variantCurrent?.calculationName}
                  </div>
                  {infoLink?.publicLinkUrl?.length > 0 && (
                    <button type="text" className="change_model" onClick={() => changeModelOpen()}>
                      Заменить ИПМ модель
                    </button>
                  )}
                </div>
              </div>
              <div className="">
                <div className="select">
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Канал продаж</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={channel}
                      onChange={changeChannel}>
                      <MenuItem value={1}>Сайт</MenuItem>
                      <MenuItem value={2}>Торговый зал</MenuItem>
                      <MenuItem value={3}>Каталог</MenuItem>
                      <MenuItem value={4}>Рассылка</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="select">
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Пользователь</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="long-select"
                      value={user}
                      MenuProps={{ classes: { paper: classes.menuPaper } }}
                      onChange={(e) => {
                        setUser(e.target.value);
                      }}>
                      {users?.map((u) => {
                        return (
                          <MenuItem value={u?.guid}>
                            {u?.lastName} {u?.name} - {u?.login}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
                <span className="select">
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Тип ссылки</InputLabel>

                    {/* disabled={phoneOpen ? true : false} */}
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={types}
                      onChange={changeType}>
                      <MenuItem value={1}>QR-код</MenuItem>
                      <MenuItem value={2}>Виджет</MenuItem>
                      <MenuItem value={3}>Телефон</MenuItem>
                      <MenuItem value={4}>Обратный звонок</MenuItem>
                    </Select>
                  </FormControl>
                </span>
                <span className="select">
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Папка</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={place}
                      onChange={changePlace}>
                      {groups?.map((c) => {
                        return <MenuItem value={c?.guid}>{c?.name}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </span>
                <hr />
              </div>
            </div>
            {types == 1 && (
              <div className="blockView">
                <div>Общественная ссылка на вариант №{currentVariantIndex()}</div>
                <span>Вид ссылки: </span>
                <FormControlLabel
                  checked={select === 'Chat'}
                  value="Chat"
                  control={<Radio color="primary" onClick={handleChange} />}
                  label="2D"
                  labelPlacement="bottom"
                />
                <FormControlLabel
                  checked={select === '3D'}
                  value="3D"
                  control={<Radio color="primary" onClick={handleChange} />}
                  label="3D"
                  labelPlacement="bottom"
                />
                <FormControlLabel
                  checked={select === '3D'}
                  value="3D"
                  control={<Radio color="primary" onClick={handleChange} />}
                  label="AR"
                  disabled
                  labelPlacement="bottom"
                />
                <FormControlLabel
                  checked={select === '3D'}
                  value="3D"
                  control={<Radio color="primary" onClick={handleChange} />}
                  label="VR"
                  disabled
                  labelPlacement="bottom"
                />

                {select == '3D' && (
                  <>
                    <br />
                    <br />
                    <span>Тип запуска 3D: </span>
                    <FormControlLabel
                      checked={typeThree === '1'}
                      value="1"
                      control={<Radio color="primary" onClick={handleChangeType} />}
                      label="Vroom"
                      labelPlacement="bottom"
                    />
                    <FormControlLabel
                      checked={typeThree === '2'}
                      value="2"
                      control={<Radio color="primary" onClick={handleChangeType} />}
                      label="Vroom+ (вкладка)"
                      labelPlacement="bottom"
                    />
                    <br />
                  </>
                )}

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={handleChangeChecked}
                      name="stories"
                      color="primary"
                      disabled
                    />
                  }
                  label="Запустить сториз"
                />
              </div>
            )}
            {types == 2 && (
              <div className="blockView">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.save}
                      onChange={handleChangeCheck}
                      name="save"
                      color="primary"
                    />
                  }
                  label="Показывать кнопку сохранить"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.price}
                      onChange={handleChangeCheck}
                      name="price"
                      color="primary"
                    />
                  }
                  label="Показывать цену"
                />
                {state.save && (
                  <>
                    <span className="select">
                      <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Папка</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={placeSave}
                          onChange={changePlaceSave}>
                          {groups?.map((c) => {
                            return <MenuItem value={c?.guid}>{c?.name}</MenuItem>;
                          })}
                        </Select>
                      </FormControl>
                    </span>
                    <br />
                    <br />
                  </>
                )}

                <p>
                  Для интеграции виджета, пожалуйста, вставьте следующий код где угодно на странице:
                </p>
                <pre>
                  <span class="linenumbers">
                    <i></i>
                  </span>
                  <code>
                    <script type="module">
                      import * as varwidget from
                      <br /> "https://widget.system123.ru/v0/varwidget.js";
                      <br />
                      window.varwidget = varwidget;
                    </script>
                  </code>
                </pre>
                <p>
                  И следующий код в том месте, где хотите расположить кнопку для открытия виджета:
                </p>
                <pre>
                  <span class="linenumbers">
                    <i></i>
                  </span>
                  <code>
                    &lt;button onclick=
                    <br />
                    "varwidget.showPublicLink
                    <br />
                    ('{guidLink}')"
                    <br />
                    &gt; Открыть виджет&lt;/button&gt;
                  </code>
                </pre>
                <p>
                  Вы можете стилизовать кнопку под ваши нужды. Главное – оставить обработчик события
                  onclick.
                </p>
              </div>
            )}
            {types == 3 && (
              <div className="blockView">
                <input
                  type="text"
                  placeholder="Телефон"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="select">
                  <div className="card flex justify-content-center">
                    <TreeSelect
                      value={selectedNodeKey}
                      label="folderId"
                      onChange={(e) => {
                        setSelectedNodeKey(e.value);
                      }}
                      name="name"
                      inputId="folderId"
                      options={catalog}
                      className="md:w-20rem w-full"
                      placeholder="Каталог"></TreeSelect>
                  </div>
                </div>
              </div>
            )}
            {types == 4 && (
              <div className="blockView">
                <input
                  type="text"
                  placeholder="URL формы обратной связи"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <div className="select">
                  <div className="card flex justify-content-center">
                    <TreeSelect
                      value={selectedNodeKey}
                      label="folderId"
                      onChange={(e) => {
                        setSelectedNodeKey(e.value);
                      }}
                      name="name"
                      inputId="folderId"
                      options={catalog}
                      className="md:w-20rem w-full"
                      placeholder="Каталог"></TreeSelect>
                  </div>
                </div>
              </div>
            )}
          </div>
          {infoLink?.publicLinkUrl?.length > 0 ? (
            <div className="form--row mar-top">
              <input type="submit" name="time" value="Сохранить" onClick={() => updateLink()} />
              {'   '}
              <input
                type="submit"
                name="time"
                value="Отменить"
                onClick={() => {
                  dispatch(setOpenPublicForm(!open));
                  dispatch(clear());
                }}
              />
              <input
                type="submit"
                name="delete"
                value="Удалить"
                onClick={() => {
                  confirm();
                }}
              />
            </div>
          ) : (
            types != 2 && (
              <div className="form--row send-qr">
                <input type="submit" name="time" value="Получить QR" onClick={() => openQR()} />
              </div>
            )
          )}

          {infoLink?.publicLinkUrl?.length == undefined && types == 2 && (
            <div className="form--row send-qr">
              <input
                type="submit"
                name="time"
                value="Получить код виджета"
                onClick={() => getCode()}
              />
            </div>
          )}

          <div
            className={
              'qr-view qr-view--display ' +
              (infoLink?.publicLinkUrl?.length > 0 && types == 1 && 'qr-view--display-view')
            }
            ref={hidden}>
            {open && <QRCode value={link} renderAs={'svg'} />}
            {open && link && (
              <>
                <input id="copyLink" disabled value={link} />
                <div className="tooltip">
                  <i onClick={(e) => copyLink(e)} onMouseOut={(e) => outFunc(e)}>
                    <span class="tooltiptext" id="TooltipText">
                      Копировать
                    </span>
                  </i>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default PublicLink;
