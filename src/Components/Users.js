import React, { useEffect, useState } from 'react';
import Network from './Requests';
import Dialog from '@material-ui/core/Dialog';
import QRCode from 'qrcode.react';
import Timer from 'react-compound-timerv2';
import { globalConfig } from '../configuration/config';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useSelector, useDispatch } from 'react-redux';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import Share from './Share';
import CompanyUser from './CompanyUser';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { setCountUser } from '../store/reducers/projectSlice';
import {} from '../store/reducers/usersSlice';
import { cloneDeep } from 'lodash';

const useStyles = makeStyles({
  title: {
    fontSize: 50,
  },
});

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const timerProps = {
  isPlaying: true,
  size: 65,
  strokeWidth: 2,
};

const rendTime = (remainingTime) => {
  let day = Math.floor(remainingTime / 86400);
  let hours = Math.floor(remainingTime / 3600);
  let minutes = Math.floor((remainingTime % 3600) / 60);
  let seconds = Math.floor(remainingTime % 60);

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  if (remainingTime > daySeconds) {
    return `${day}д.`;
  }

  if (remainingTime > hourSeconds) {
    return `${hours}:${minutes}:${seconds}`;
  }
  if (remainingTime > minuteSeconds) {
    return `${minutes}:${seconds}`;
  }
};

const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time) => (time / daySeconds) | 0;

export default function Users(props) {
  const variantId = useSelector((state) => state?.variant?.current?.calculationGuid);
  const [isDisabled, setIsDisabled] = useState(true);
  const [input, setInput] = useState(props.current.name);
  const [time, setTime] = useState();
  const [users, setUsers] = useState();
  const [modal, setModal] = useState(false);
  const companyId = useSelector((state) => state.project.companyId);
  const changeUser = useSelector((state) => state.variant.changeUser);
  const userCounters = useSelector((state) => state.project.projectUserCounters);
  const usersStore = useSelector((state) => state?.users?.usersList);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      // const data = usersStore;
      const data = cloneDeep(usersStore);
      for (let i = 0; i < data?.length; i++) {
        const element = data[i];

        if (element.hasLink != false && element.structureUrl != null) {
          let sec = (Date.parse(element.structureUrl.expiresAtFormatString) - Date.now()) / 1000;
          let secFull =
            (Date.parse(element.structureUrl.expiresAtFormatString) -
              Date.parse(element.structureUrl.createdAtFormatString)) /
            1000;
          element.structureUrl.stringDateLeft = sec;
          element.structureUrl.stringDateFull = secFull;
          element.structureUrl.days = getTimeDays(sec);
          element.structureUrl.hours = getTimeHours(sec);
          element.structureUrl.minutes = getTimeMinutes(sec);
          element.structureUrl.seconds = getTimeSeconds(sec);
        }
      }
      setUsers(data);
      if (data != undefined) {
        dispatch(setCountUser(data?.length));
      }
    };
    fetch();
  }, [variantId]);

  useEffect(() => {
    if (props.current.projectGuid != undefined && Object.keys(changeUser).length != 0) {
      const fetch = async () => {
        const data = await new Network().getUsersProject(props.current.projectGuid);
        for (let i = 0; i < data?.length; i++) {
          const element = data[i];

          if (element.hasLink != false && element.structureUrl != null) {
            let sec = (Date.parse(element.structureUrl.expiresAtFormatString) - Date.now()) / 1000;
            let secFull =
              (Date.parse(element.structureUrl.expiresAtFormatString) -
                Date.parse(element.structureUrl.createdAtFormatString)) /
              1000;
            element.structureUrl.stringDateLeft = sec;
            element.structureUrl.stringDateFull = secFull;
            element.structureUrl.days = getTimeDays(sec);
            element.structureUrl.hours = getTimeHours(sec);
            element.structureUrl.minutes = getTimeMinutes(sec);
            element.structureUrl.seconds = getTimeSeconds(sec);
          }

          if (element.guid === userCounters?.guidUser) {
            if (userCounters.entryCount != null) {
              element.sliceCounters.entryCount = userCounters.entryCount;
            }

            if (userCounters.shareCount != null) {
              element.sliceCounters.shareCount = userCounters.shareCount;
            }

            if (userCounters.viewCount != null) {
              element.sliceCounters.viewCount = userCounters.viewCount;
            }
          }
        }
        dispatch(setCountUser(data?.length));
        setUsers(data);
      };
      fetch();
    }
  }, [changeUser]);
  //, props, companyId

  // useEffect(() => {
  //   if (modal == false) {
  //     const fetch = async () => {
  //       const data = await new Network().getUsersProject(props.current.projectGuid);
  //       // setUsers(data);
  //       dispatch(setCountUser(data?.length));
  //     };
  //     fetch();
  //   }
  // }, [changeUser]);

  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  // for (let i = 0; i < props?.current?.users?.length; i++) {
  //   const element = props.current.users[i];

  //   if (element.hasLink != false && element.hasLink != undefined) {
  //     let sec = (Date.parse(element.structureUrl.expiresAtFormatString) - Date.now()) / 1000;
  //     let secFull =
  //       (Date.parse(element.structureUrl.expiresAtFormatString) -
  //         Date.parse(element.structureUrl.createdAtFormatString)) /
  //       1000;
  //     element.structureUrl.stringDateLeft = sec;
  //     element.structureUrl.stringDateFull = secFull;
  //     element.structureUrl.days = getTimeDays(sec);
  //     element.structureUrl.hours = getTimeHours(sec);
  //     element.structureUrl.minutes = getTimeMinutes(sec);
  //     element.structureUrl.seconds = getTimeSeconds(sec);
  //   }

  //   if (element.guid === userCounters?.guidUser) {
  //     if (userCounters.entryCount != null) {
  //       element.sliceCounters.entryCount = userCounters.entryCount;
  //     }

  //     if (userCounters.shareCount != null) {
  //       element.sliceCounters.shareCount = userCounters.shareCount;
  //     }

  //     if (userCounters.viewCount != null) {
  //       element.sliceCounters.viewCount = userCounters.viewCount;
  //     }
  //   }
  // }

  function num_word(value, words) {
    value = Math.abs(value) % 100;
    var num = value % 10;
    if (value > 10 && value < 20) return words[2];
    if (num > 1 && num < 5) return words[1];
    if (num == 1) return words[0];
    return words[2];
  }

  const changeTime = (e) => {
    setTime(e.target.value);
  };

  const [user, setUser] = useState(false);
  const [nameUser, setNameUser] = useState('');

  const handleCloseModal = () => {
    setModal(false);
  };

  const editLink = async (user) => {
    const endDate = user.structureUrl.expiresAtFormatString;
    const expires = new Date(endDate) - new Date();
    const url = `${globalConfig.config.common.base_url}/web/project/?id=${user?.structureUrl?.url}`;
    user.expires = expires;
    user.url = url;

    setUser(user);
    setModal(true);
    setTime(user.structureUrl.lifeTimeHours);
    setNameUser(user.name);
  };

  const changeUserName = (event) => {
    setNameUser(event.target.value);
  };

  const handleSave = async () => {
    const update = await new Network().UpdateStructureUrl(
      user.structureUrl.url,
      user.structureUrl.createdUserByUrl.name,
      time,
    );
    if (update.status == 'error') {
      alert('Время жизни ссылки слишком мало. Ссылка всё ещё не актуальна.');
    } else {
      handleCloseModal();
    }
  };

  function copyLink(e) {
    var copyText = document.getElementById('copyLink');
    window.navigator.clipboard.writeText(copyText.value);
    var tooltip = document.getElementById('TooltipText');
    tooltip.innerHTML = 'Скопировано';
  }

  function outFunc(e) {
    var tooltip = document.getElementById('TooltipText');
    tooltip.innerHTML = 'Копировать';
  }

  const sendEmail = async (e) => {
    e.preventDefault();
    const update = await new Network().UpdateStructureUrl(
      user.structureUrl.url,
      user.structureUrl.createdUserByUrl.name,
      time,
    );
    if (update.status == 'error') {
      alert('Время жизни ссылки слишком мало. Ссылка всё ещё не актуальна.');
    } else {
      const send = await new Network().OnlySendLinkToEmail(user.structureUrl.url, user.email);
      handleCloseModal();
    }
  };

  const sendViber = async (e) => {
    e.preventDefault();
    const update = await new Network().UpdateStructureUrl(
      user.structureUrl.url,
      user.structureUrl.createdUserByUrl.name,
      time,
    );
    if (update.status == 'error') {
      alert('Время жизни ссылки слишком мало. Ссылка всё ещё не актуальна.');
    } else {
      const send = await new Network().OnlySendLinkToViber(
        user?.structureUrl?.url,
        user?.structureUrl?.createdUserByUrl?.phone,
      );
      handleCloseModal();
    }
  };

  const sendSms = async (e) => {
    e.preventDefault();
    const update = await new Network().UpdateStructureUrl(
      user.structureUrl.url,
      user.structureUrl.createdUserByUrl.name,
      time,
    );
    if (update.status == 'error') {
      alert('Время жизни ссылки слишком мало. Ссылка всё ещё не актуальна.');
    } else {
      const send = await new Network().OnlySendLinkToSMS(
        user?.structureUrl?.url,
        user?.structureUrl?.createdUserByUrl?.phone,
      );
      handleCloseModal();
    }
  };

  const [openShare, setOpenShare] = React.useState(false);
  const [openAddUsers, setOpenAddUsers] = React.useState(false);
  const storage = localStorage.getItem('company');
  var storageCompany = JSON.parse(storage);
  var currentCompany = '';
  if (storageCompany != null && storageCompany.id > 0) {
    currentCompany = storageCompany.name;
  }

  const closePopup = () => {
    setOpenAddUsers(false);
  };
  return (
    <>
      <div className="project-title">Список участников</div>
      {companyId > 0 && props.current.forDisplayTape == false && (
        <>
          <Dialog
            open={openShare}
            keepMounted
            onClose={() => {
              setOpenShare(false);
            }}>
            <DialogContent>
              <Share
                close={() => {
                  setOpenShare(false);
                }}
                companyId={companyId}
                variantGuid={variantId}
                guid={props.current.projectGuid}
                chats={props.current.chats}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={openAddUsers}
            keepMounted
            onClose={() => {
              setOpenAddUsers(false);
            }}>
            <DialogContent>
              <CompanyUser
                currentCompanyId={companyId}
                projectGuid={props.current.projectGuid}
                companyId={companyId}
                companyName={currentCompany}
                close={() => {
                  setOpenAddUsers(false);
                }}
                users={props.current.users}
                chats={props.current.chats}
                closePopup={closePopup}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
      <DialogContent dividers>
        {users?.map((user) => {
          return (
            <div className="user">
              <div className="user-info">
                <img src={user.profilePicturePath} />
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-date">{user.registrationDate}</div>
                </div>
              </div>
              <div>
                {user.structureUrl != null && user.structureUrl.stringDateLeft > 0 && (
                  <CountdownCircleTimer
                    {...timerProps}
                    colors="#3390ec"
                    duration={user.structureUrl.stringDateFull}
                    size="35"
                    initialRemainingTime={user.structureUrl.stringDateLeft}>
                    {({ elapsedTime, color }) => (
                      <span className="time" style={{ color }} onClick={() => editLink(user)}>
                        {rendTime(user.structureUrl.stringDateFull - elapsedTime)}
                      </span>
                    )}
                  </CountdownCircleTimer>
                )}
                {user.structureUrl != null && user.structureUrl.stringDateLeft < 0 && (
                  <div className="timer-late" onClick={() => editLink(user)}></div>
                )}
              </div>
              <div className="project-counter">
                <div className="pr-counter">
                  <div className="pr-counter--item view">{user?.sliceCounters.viewCount}</div>
                  <div className="pr-counter--item share">{user?.sliceCounters.shareCount}</div>
                  <div className="pr-counter--item entry">{user?.sliceCounters.entryCount}</div>
                </div>
              </div>
            </div>
          );
        })}
      </DialogContent>
      {companyId > 0 && props.current.forDisplayTape == false && (
        <div className="buttons-users">
          <div
            onClick={() => {
              setOpenShare(true);
            }}>
            Пригласить
          </div>
          <div
            onClick={() => {
              setOpenAddUsers(true);
            }}>
            Добавить пользователя
          </div>
        </div>
      )}
      <Dialog
        open={modal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogContent>
          <div className="share">
            <div className="share--item">
              <span>Имя клиента</span>
              <input
                type="text"
                id="user"
                name="user"
                value={nameUser}
                autoComplete="off"
                data-clear=""
                onChange={(e) => changeUserName(e)}
              />
            </div>
            <div className="share--item share--item--qr">
              <div className="share--item--title">
                <span>Время жизни ссылки в часах:</span>
                <span>Осталось времени:</span>
              </div>
              <form>
                <input
                  type="text"
                  id="time"
                  name="time"
                  value={time}
                  autoComplete="off"
                  data-clear=""
                  onChange={changeTime}
                />
                <div>
                  {user.expires > 0 ? (
                    <Timer initialTime={user.expires} direction="backward">
                      {() => (
                        <React.Fragment>
                          <Timer.Days />
                          д.
                          <Timer.Hours />:
                          <Timer.Minutes />:
                          <Timer.Seconds />
                        </React.Fragment>
                      )}
                    </Timer>
                  ) : (
                    <p>00:00</p>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="qr-view visible">
            {user?.url !== undefined && <QRCode value={user?.url} renderAs={'svg'} />}
            {user.url !== undefined && (
              <>
                <input id="copyLink" disabled value={user?.url} />
                <div className="tooltip">
                  <i onClick={(event) => copyLink(event)} onMouseOut={(event) => outFunc(event)}>
                    <span class="tooltiptext" id="TooltipText">
                      Копировать
                    </span>
                  </i>
                </div>
              </>
            )}
            <hr />
            <div className="share--item">
              <span>Email</span>
              <form>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={user.email}
                  autoComplete="off"
                  data-clear=""
                  disabled="disabled"
                />
                <input type="submit" name="email" onClick={(e) => sendEmail(e)} />
              </form>
            </div>
            <div className="share--item">
              <span>Viber</span>
              <form>
                <input
                  type="text"
                  id="viber"
                  name="viber"
                  value={user.phone}
                  autoComplete="off"
                  data-clear=""
                  disabled="disabled"
                />
                <input type="submit" onClick={(e) => sendViber(e)} />
              </form>
            </div>
            <div className="share--item">
              <span>СМС</span>
              <form>
                <input
                  type="text"
                  id="sms"
                  name="sms"
                  value={user.phone}
                  autoComplete="off"
                  data-clear=""
                  disabled="disabled"
                />
                <input type="submit" onClick={(e) => sendSms(e)} />
              </form>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="share-cancel button" onClick={handleSave}>
            Сохранить
          </div>
          <div className="share-cancel button" onClick={handleCloseModal}>
            Отмена
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
