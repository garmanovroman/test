import React, { useEffect, useState, useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { clear, setLink, setList, setPhone } from '../../store/reducers/linkSlice';
import Snackbar from '@material-ui/core/Snackbar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import {
  setOpen,
  setCatalog,
  setVariant,
  setCurrent,
  clearChangeModel,
} from '../../store/reducers/changeModelSlice';
import Network from '../Requests';
import { ConsoleView } from 'react-device-detect';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  menuPaper: {
    maxHeight: 200,
  },
});

const ChangeModel = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const companyId = useSelector((state) => state?.project?.companyId);
  const projectGuid = useSelector((state) => state?.guids?.project);
  const open = useSelector((state) => state.changeModel?.open);
  const catalog = useSelector((state) => state.changeModel?.catalog);
  const variant = useSelector((state) => state.changeModel?.variant);
  const current = useSelector((state) => state.changeModel?.current);
  const infoLink = useSelector((state) => state.link?.info);
  const [catalogSearch, setCatalogSearch] = useState();
  const selectItem = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await new Network().GetCatalog(companyId, '', true);
      dispatch(setCatalog(res));
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (open) {
        const variant = await new Network().GetVariantss(
          infoLink?.guidProject,
          null,
          false,
          false,
          null,
          10000,
        );
        const resAll = await new Network().GetCatalog(companyId, '', true);

        const res = await new Network().GetCatalogPath(
          infoLink?.guidCalculation,
          false,
          infoLink?.guidProject,
        );

        const resp = await new Network().GetCatalogPath(
          infoLink?.guidCalculation,
          true,
          infoLink?.guidProject,
        );
        const ids = res?.split('/');
        const idsName = resp?.split('/');
        let search = false;

        for (let i = 0; i < resAll?.length; i++) {
          const element = resAll[i];
          if (element?.id != ids[0]) {
            dispatch(setCatalog(resAll));
          } else {
            search = true;
          }
        }

        if (search) {
          let bread = [];
          for (let i = 0; i < ids.length; i++) {
            const element = ids[i];
            if (Number.isInteger(Number(element)) && Number(element) != 0) {
              bread.push({ id: Number(element), name: idsName[i] });
            }
          }
          // console.log(ids, 'idsidsids');
          // console.log(bread, 'breadbread');
          bread.push({ name: infoLink?.calculationName });
          let insert = breadcrumb.concat(bread);
          setBreadcrumb(insert);
          dispatch(setVariant(variant));
          dispatch(
            setCurrent({
              calculationGuid: infoLink?.guidCalculation,
              projectGuid: infoLink?.guidProject,
              calculationName: infoLink?.calculationName,
              iconPath: infoLink?.iconPath,
            }),
          );
          selectItem.current.focus();
          selectItem.current.scrollIntoView();
        }
      }
    };
    fetch();
  }, [open]);

  const initialBreadcrumbState = [
    {
      name: 'Категория',
      projectGuid: projectGuid,
      idCompany: companyId,
      id: null,
      idUser: null,
      type: 4,
    },
  ];
  const [breadcrumb, setBreadcrumb] = useState(initialBreadcrumbState);
  const next = async (idCompany, id, isAllChats = true, guid, name) => {
    if (guid) {
      const res = await new Network().GetVariantss(guid, null, false, false, null, 10000);
      setBreadcrumb([
        ...breadcrumb,
        {
          name: name,
        },
      ]);
      dispatch(setVariant(res));
    } else {
      setBreadcrumb([
        ...breadcrumb,
        {
          name: name,
          idCompany: companyId,
          id: id,
        },
      ]);
      const res = await new Network().GetCatalog(idCompany, id, isAllChats);
      dispatch(setCatalog(res));
    }
  };

  const formateDate = (date) => {
    let d = new Date(date);
    return (
      String(d.getDate()).padStart(2, '0') +
      '.' +
      String(d.getMonth()).padStart(2, '0') +
      '.' +
      d.getFullYear() +
      ' ' +
      String(d.getHours()).padStart(2, '0') +
      ':' +
      String(d.getMinutes()).padStart(2, '0')
    );
  };

  const changeCatalog = (id) => {
    const fetch = async () => {
      const res = await new Network().GetCatalog(companyId, id, true);
      let ins = [];
      for (let i = 0; i < breadcrumb.length; i++) {
        const element = breadcrumb[i];
        ins.push(element);
        if (element?.id == id) {
          break;
        }
      }
      setBreadcrumb(ins);
      dispatch(setCatalog(res));
      dispatch(setVariant([]));
    };
    fetch();
  };

  const back = () => {
    var clone = Object.assign([], breadcrumb);
    var last = clone.slice(-2);
    setBreadcrumb((breadcrumb) => breadcrumb.slice(0, -1));
    const fetch = async () => {
      const res = await new Network().GetCatalog(companyId, last[0]?.id, true);
      dispatch(setCatalog(res));
      dispatch(setVariant([]));
    };
    fetch();
  };

  const accept = () => {
    console.log('Todo замена модели');
    close();
  };

  const reject = () => {
    // dispatch(setOpen(false));
    // dispatch(setCurrent({}));
    // dispatch(setVariant([]));
    // setBreadcrumb(initialBreadcrumbState);
  };

  const confirms = () => {
    confirmDialog({
      message: 'Вы уверены что хотите выбрать эту ИПМ модель?',
      header: 'Заменить модель?',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: '',
      rejectLabel: 'Нет',
      acceptLabel: 'Да',
      accept,
      reject,
    });
  };

  const close = () => {
    dispatch(setOpen(false));
    dispatch(setCatalog([]));
    dispatch(setVariant([]));
    dispatch(clearChangeModel());
    setBreadcrumb(initialBreadcrumbState);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(setOpen(false));
        dispatch(setCatalog([]));
        dispatch(setVariant([]));
        dispatch(clearChangeModel());
        setBreadcrumb(initialBreadcrumbState);
      }}>
      <DialogContent>
        {/* <ConfirmDialog /> */}
        {/* <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {message}
          </Alert>
        </Snackbar> */}
        <div id="pr_id_7_header" class="p-dialog-title" data-pc-section="headertitle">
          <span>Заменить ИПМ модель</span>
          <span className="close_ipm" onClick={() => close()}>
            X
          </span>
        </div>
        <div className="project-breadcrumbs project-breadcrumbs--change">
          {breadcrumb.length > 0 && (
            <div className="breadcrumb-back" onClick={breadcrumb.length > 1 && back}></div>
          )}
          <div className="breadcrumb-title breadcrumb-title--catalog">
            {breadcrumb.length > 0 &&
              breadcrumb.map((breadcrumb, index) => {
                return (
                  <div
                    className={typeof breadcrumb.id === 'undefined' && 'close'}
                    onClick={() => changeCatalog(breadcrumb?.id)}>
                    {breadcrumb.name}/
                  </div>
                );
              })}
          </div>
        </div>
        <div className="change-model">
          {variant?.length == 0 &&
            catalog?.map((i) => {
              return (
                <div
                  key={i?.id ? i?.id : i?.guid}
                  className="change-model--item"
                  onClick={() => next(companyId, i.id, true, i?.guid, i?.name)}>
                  <div
                    className="change-model--item--img"
                    style={{
                      backgroundImage: `url(${i.iconPath && i.iconPath.replace(/ /gi, '%20')})`,
                    }}></div>
                  <div className="change-model--item--name">{i?.name}</div>
                </div>
              );
            })}
          {variant?.length > 0 &&
            variant?.map((i) => {
              return (
                <div
                  key={i?.id ? i?.id : i?.guid}
                  className={
                    'change-model--item change-model--item--var ' +
                    (current?.calculationGuid == i?.calculationGuid && 'active')
                  }
                  {...(current?.calculationGuid == i?.calculationGuid && { ref: selectItem })}
                  onClick={() =>
                    dispatch(
                      setCurrent({
                        calculationGuid: i?.calculationGuid,
                        projectGuid: i?.projectGuid,
                        calculationName: i?.calculationName,
                        iconPath: i?.iconPath,
                      }),
                    )
                  }>
                  <div
                    className="change-model--item--img change-model--item--img--var"
                    style={{
                      backgroundImage: `url(${i.iconPath && i.iconPath.replace(/ /gi, '%20')})`,
                    }}></div>
                  <div className="change-model--item--name change-model--item--name--var">
                    {i?.calculationName}
                  </div>
                  <hr />
                  <div className="change-model--date">{formateDate(i?.createdAt)}</div>
                </div>
              );
            })}
        </div>
        {current?.calculationGuid?.length > 0 && (
          <div className="change-model--save">
            <input
              type="submit"
              value="Выбрать"
              onClick={() => {
                confirms();
              }}
            />
            <input
              type="submit"
              onClick={() => {
                close();
              }}
              value="Отменить"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default ChangeModel;
