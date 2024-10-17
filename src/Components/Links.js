import axios from 'axios';
import React, { Component, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Network from './Requests';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { globalConfig } from '../configuration/config';
import { setLink, linkActive, setList, setPhone } from '../store/reducers/linkSlice';
import { setOpenPublicForm, setCloseActionPanel } from '../store/reducers/saveGuids';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflowY: 'scroll',
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 700,
    backgroundColor: theme.palette.background.paper,
    border: '0px solid #000',
    boxShadow:
      '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
    borderRadius: '8px',
    overflowY: 'scroll',
  },
  table: {
    minWidth: 650,
    maxWidth: 650,
  },
}));

const channel = ['', 'Сайт', 'Торговый зал', 'Каталог', 'Рассылка'];
const types = ['', 'QR-код', 'Виджет', 'Телефон', 'Обратный звонок'];

const Links = () => {
  const classes = useStyles();

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [count, setCount] = React.useState();
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState([]);
  let size = 50;

  const dispatch = useDispatch();
  const companyId = useSelector((state) => state.project.companyId);
  const linkList = useSelector((state) => state?.link?.list);
  const openPublic = useSelector((state) => state.guids.openPublicForm);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetch = async () => {
      const send = await new Network().GetPublicLinks(companyId, page, size);

      for (let i = 0; i < send?.data.length; i++) {
        const element = send?.data[i];
        let start = new Date(element.activeFrom);
        let end = new Date(element.activeTo);
        let diff = Date.parse(end) - Date.parse(start);
        element.seconds = diff / 1000;
      }
      dispatch(setList(send?.data));
    };
    if (companyId !== null && companyId !== undefined && companyId !== 'null') {
      fetch();
    }
  }, [companyId, openPublic]);

  const openEditEmpty = () => {
    dispatch(setPhone(true));
    dispatch(setOpenPublicForm(true));
  };

  const openEdit = (link) => {
    dispatch(setOpenPublicForm(true));
    dispatch(setLink(link));
  };

  const timerProps = {
    isPlaying: true,
    size: 65,
    strokeWidth: 3,
  };

  const timeLeft = (timeEnd, sec) => {
    let start = new Date();
    let end = new Date(timeEnd);
    let diff = Date.parse(end) / 1000 - Date.parse(start) / 1000;
    return diff;
  };

  const minuteSeconds = 60;
  const hourSeconds = 3600;
  const daySeconds = 86400;

  const rendTime = (remainingTime) => {
    let diff = (Date.parse(new Date(remainingTime)) - new Date()) / 1000;
    let day = Math.floor(diff / 86400);
    let hours = Math.floor(diff / 3600);
    let minutes = Math.floor((diff % 3600) / 60);
    let seconds = Math.floor(diff % 60);

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    if (diff > daySeconds) {
      return `${day}д.`;
    }

    if (diff > hourSeconds) {
      return `${hours}ч.`;
    }
    if (diff > minuteSeconds) {
      return `${minutes}м.`;
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableScrollLock="true">
        <div style={modalStyle} className={classes.paper}>
          <div className="links">
            <div className="links-wrapper">
              <h3 id="simple-modal-title">Ссылки компании</h3>
              <div className="add-links">
                <span onClick={() => openEditEmpty()}>Добавить</span>
              </div>
            </div>
            <div className="links-wrapper">
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Иконка</TableCell>
                      <TableCell>Название</TableCell>
                      <TableCell>Канал продаж</TableCell>
                      <TableCell>Тип</TableCell>
                      <TableCell>Время</TableCell>
                      <TableCell></TableCell>
                      {/* <TableCell>Перейти</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {linkList.map((row) => (
                      <TableRow key={row.guid} onClick={() => openEdit(row)}>
                        <TableCell>
                          <div
                            className="back-img"
                            style={{
                              backgroundImage: `url(${row?.iconPath && row?.iconPath})`,
                            }}></div>
                        </TableCell>
                        <TableCell>{row?.calculationName}</TableCell>
                        <TableCell>{channel[row?.salesChanel]}</TableCell>
                        <TableCell>{types[row?.varietyType]}</TableCell>
                        {/* <TableCell>
                          <a
                            href={
                              globalConfig.config.common.chat +
                              '/app?pr=' +
                              row?.guidProject +
                              '&variant=' +
                              row?.guidCalculation
                            }
                            target="_blank"
                            className="link-pr">
                            Проект
                          </a>
                        </TableCell> */}
                        {Date.parse(new Date(row?.activeTo)) == 0 && (
                          <TableCell align="center">
                            <div className="timer-inf"></div>
                          </TableCell>
                        )}
                        {(Date.parse(new Date(row?.activeFrom)) - Date.parse(new Date()) > 0 ||
                          Date.parse(new Date(row?.activeTo)) - Date.parse(new Date()) < 0) &&
                          Date.parse(new Date(row?.activeTo)) != 0 && (
                            <TableCell align="center">
                              <div className="timer-late"></div>
                            </TableCell>
                          )}
                        {Date.parse(new Date()) - Date.parse(new Date(row?.activeFrom)) > 0 &&
                          Date.parse(new Date()) - Date.parse(new Date(row?.activeTo)) < 0 && (
                            <TableCell align="center">
                              <div className="cicle-pad">
                                <CountdownCircleTimer
                                  {...timerProps}
                                  colors="#3390ec"
                                  duration={
                                    (Date.parse(new Date(row?.activeTo)) -
                                      Date.parse(new Date(row?.activeFrom))) /
                                    1000
                                  }
                                  size="45"
                                  trailColor="#A5A5A5"
                                  initialRemainingTime={
                                    (Date.parse(new Date(row?.activeTo)) - Date.parse(new Date())) /
                                    1000
                                  }>
                                  {({ elapsedTime, color }) => (
                                    <span className="time-links" style={{ color }}>
                                      {rendTime(row?.activeTo)}
                                    </span>
                                  )}
                                </CountdownCircleTimer>
                              </div>
                              {/* <div className="timer-late"></div> */}
                            </TableCell>
                          )}

                        <TableCell align="center">{row?.visitsCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </Modal>
      <Button className="bm-item menu-item" onClick={handleOpen}>
        Общественные ссылки
      </Button>
    </div>
  );
};

export default Links;
