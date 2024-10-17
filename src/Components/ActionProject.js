import React, { useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Share from './Share';
import CompanyUser from './CompanyUser';
import ShareCompany from './ShareCompany';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Network from './Requests';
import CalculationInfo from './CalculationInfo';
import { useSelector, useDispatch } from 'react-redux';
import { deleteItem, setCurrent } from '../store/reducers/variantSlice';
import {
  setOpenPublicForm,
  setCopyTemplate,
  setCloseActionPanel,
} from '../store/reducers/saveGuids';
import { globalConfig } from '../configuration/config';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const options = ['Поделиться'];

const ITEM_HEIGHT = 48;

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    minHeight: '400px',
  },
}));

export default function ActionProject(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const current = useSelector((state) => state.variant.current);
  const openPublickForm = useSelector((state) => state.guids.openPublicLinkForm);
  const actionPanel = useSelector((state) => state.guids.closeActionPanel);
  const companyId = useSelector((state) => state.project.companyId);
  const companyIdVariant = useSelector((state) => state.variant.current?.idCompany);
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openModal, setOpen] = React.useState(false);
  const [openModalBazis, setOpenBazis] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const exportBazis = async () => {
    try {
      const response = await axios.post(
        'https://api.system123.ru/api/Projects/ConvertToBazis',
        {
          projectGuid: current?.projectGuid,
          calculationGuid: current?.calculationGuid,
        },
        {
          withCredentials: true,
        },
      );
      setOpenBazis(false);
    } catch (error) {
      console.log(error);
      setOpenBazis(false);
    }
  };
  const handleCloseModal = () => {
    setOpen(false);
  };

  const [openModalUser, setOpenUser] = React.useState(false);

  const handleClickOpenUser = () => {
    setOpenUser(true);
  };

  const [openModalFirm, setOpenFirm] = React.useState(false);

  const handleClickOpenFirm = () => {
    setOpenFirm(true);
  };

  const [openModalInfo, setOpenInfo] = React.useState(false);

  const handleClickOpenInfo = () => {
    setOpenInfo(true);
  };

  const handleCloseModalInfo = () => {
    setOpenInfo(false);
  };

  const handleCloseModalBazis = () => {
    setOpenBazis(true);
  };

  const [openModalDelete, setModalDelete] = React.useState(false);
  const [openModalDeleteVariant, setModalDeleteVariant] = React.useState(false);

  const handleClickModalDelete = () => {
    setModalDelete(true);
  };

  const handleClickModalDeleteVariant = () => {
    setModalDeleteVariant(true);
  };

  const handleCloseModalDelete = () => {
    setModalDelete(false);
  };

  const handleCloseModalDeleteVariant = () => {
    setModalDeleteVariant(false);
  };

  const handleDetele = () => {
    if (props?.current?.forDisplayTape == false) {
      new Network().DeleteProject(props.current.projectGuid);
      props.onDeleteProject(props.current.projectGuid);
      setModalDelete(false);
    }
  };

  const handleDeteleVariant = () => {
    dispatch(deleteItem(current));
    handleCloseModalDeleteVariant();
  };

  const handleCloseModalUser = () => {
    setOpenUser(false);
  };

  const handleCloseModalFirm = () => {
    setOpenFirm(false);
  };

  const openEditor = () => {
    document.location.href = `${globalConfig.config.common.editor}/?calculation=${current.calculationGuid}&room=${current.calculationGuid}`;
  };

  const openPublicLinkForm = () => {
    dispatch(setOpenPublicForm(!openPublickForm));
  };

  const copyTemplate = () => {
    dispatch(setCopyTemplate(true));
  };

  useEffect(() => {
    if (actionPanel) {
      setAnchorEl(null);
      dispatch(setCloseActionPanel(false));
    }
  }, [actionPanel]);

  return (
    <div className="project-context-menu">
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 5.5,
            minWidth: '24ch',
          },
        }}>
        <Button className="bm-item menu-item" onClick={openPublicLinkForm}>
          Общественная ссылка
        </Button>
        <Button className="bm-item menu-item" onClick={copyTemplate}>
          Скопировать шаблон
        </Button>
        {props.current.forDisplayTape == false && (
          <Button className="bm-item menu-item" onClick={handleClickOpen}>
            Пригласить клиента
          </Button>
        )}

        <Button
          className="bm-item menu-item"
          onClick={() => {
            setOpenBazis(true);
          }}>
          Экспорт проекта в Базис
        </Button>

        <Dialog open={openModal} keepMounted onClose={handleCloseModal}>
          <DialogContent>
            <Share
              close={handleCloseModal}
              companyId={props.companyId}
              variantGuid={props.variantGuid}
              guid={props.current.projectGuid}
              chats={props.current.chats}
            />
          </DialogContent>
        </Dialog>
        {companyId > 0 && props.current.forDisplayTape == false && (
          <>
            <Button className="bm-item menu-item" onClick={handleClickOpenUser}>
              Добавить пользователя
            </Button>
            <Dialog
              classes={{ paper: classes.dialogPaper }}
              open={openModalUser}
              keepMounted
              onClose={handleCloseModalUser}>
              <DialogContent>
                <CompanyUser
                  currentCompanyId={props.companyId}
                  projectGuid={props.current.projectGuid}
                  companyId={props.companyId}
                  companyName={props.companyName}
                  close={handleCloseModalUser}
                  users={props?.current?.users}
                  chats={props?.current?.chats}
                  closePopup={handleCloseModalUser}
                />
              </DialogContent>
            </Dialog>
          </>
        )}
        {props.current.forDisplayTape == false && (
          <>
            <Button className="bm-item menu-item" onClick={handleClickOpenInfo}>
              Информация о расчёте
            </Button>
            <Button className="bm-item menu-item" onClick={handleClickOpenFirm}>
              Поделиться с фирмой
            </Button>
            <Button className="bm-item menu-item" onClick={openEditor}>
              Модификатор
            </Button>
            <Button className="bm-item menu-item" onClick={handleClickModalDeleteVariant}>
              Удалить вариант
            </Button>
            <Button className="bm-item menu-item" onClick={handleClickModalDelete}>
              Удалить проект
            </Button>
          </>
        )}

        <Dialog open={openModalInfo} keepMounted onClose={handleCloseModalInfo}>
          <DialogContent>
            <CalculationInfo variant={props.variantGuid} />
          </DialogContent>
        </Dialog>

        <Dialog open={openModalBazis} keepMounted onClose={handleCloseModalBazis}>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Данный вариант <img src={current?.mainIconPath} style={{ width: '50px' }} />{' '}
              сконвертируется в Базис. Сконвертированный файл варианта появится в чате для
              скачивания. Вы уверены, что хотите экспортировать в Базис?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <div className="share-cancel button" onClick={() => exportBazis()}>
              Да
            </div>
            <div className="share-cancel button" onClick={() => setOpenBazis(false)}>
              Нет
            </div>
          </DialogActions>
        </Dialog>

        <Dialog open={openModalFirm} keepMounted onClose={handleCloseModalFirm}>
          <DialogContent>
            <ShareCompany variantGuid={props.variantGuid} close={handleCloseModalFirm} />
          </DialogContent>
        </Dialog>

        {companyId == companyIdVariant &&
          props.current.isBaseProject == false &&
          props.current.forDisplayTape == true && (
            <>
              <Button className="bm-item menu-item" onClick={() => props.changeBaseProject(true)}>
                Запретить редактирование
              </Button>
              <Button className="bm-item menu-item" onClick={openEditor}>
                Модификатор
              </Button>
            </>
          )}
        {companyId == companyIdVariant &&
          props.current.isBaseProject == true &&
          props.current.forDisplayTape == true && (
            <>
              <Button className="bm-item menu-item" onClick={() => props.changeBaseProject(false)}>
                Разрешить редактирование
              </Button>
              <Button className="bm-item menu-item" onClick={openEditor}>
                Модификатор
              </Button>
            </>
          )}
        <Dialog open={openModalDelete} keepMounted onClose={handleCloseModalDelete}>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Вы уверены, что хотите удалить проект?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <div className="share-cancel button" onClick={() => handleDetele()}>
              Да
            </div>
            <div className="share-cancel button" onClick={handleCloseModalDelete}>
              Нет
            </div>
          </DialogActions>
        </Dialog>
        <Dialog open={openModalDeleteVariant} keepMounted onClose={handleCloseModalDeleteVariant}>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Вы уверены, что хотите удалить вариант?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <div className="share-cancel button" onClick={() => handleDeteleVariant()}>
              Да
            </div>
            <div className="share-cancel button" onClick={handleCloseModalDeleteVariant}>
              Нет
            </div>
          </DialogActions>
        </Dialog>
      </Menu>
    </div>
  );
}
