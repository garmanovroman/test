import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import usersImg from '../images/users.png';
import Network from './Requests';

const EmplButton = (props) => {
  const [open, setOpen] = React.useState(false);
  const [breadcrumb, setBreadcrumb] = React.useState([
    {
      name: 'Компания',
      idCompany: null,
      id: null,
      type: null,
    },
  ]);
  const [parent, setParent] = React.useState({
    idCompany: null,
    id: null,
    type: null,
  });
  const [users, setUsers] = React.useState([]);
  const [sourceGuid, setSourceGuid] = React.useState('');
  const [usersSearch, setUsersSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State to store the error message

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    getItems(parent?.idCompany, parent?.id, parent?.type);
  }, [parent]);

  const handleClose = () => {
    setOpen(false);
  };

  const getItems = async (idCompany, id, idUser, type) => {
    const data = await new Network().GetUserCatalogWithoutLinkedUsers(idCompany, id, idUser, type);
    setUsers(data);
  };

  var getToken = function (oldToken, newToken) {
    const elems = oldToken.split(',');
    for (let i = 0; i < elems.length; i++) {
      if (elems[i].includes('access_token')) {
        const tokenValue = elems[i].split(':')[1];
        newToken = '"' + newToken + '"';
        elems[i] = elems[i].replace(tokenValue, newToken);
      }
    }
    return elems.join(',');
  };

  const loginUserAccount = async (uGuid) => {
    try {
      setErrorMessage(''); // Reset the error message before login attempt
      const utoken = await new Network().LoginByUserGuid(uGuid);
      if (typeof utoken === 'undefined') {
        setErrorMessage('Ошибка входа под сотрудником. Попробуйте снова.');
      } else {
        // saving the old token in localStorage under a different key
        const oldToken = localStorage.getItem(
          'oidc.user:https://lab.system123.ru/identity:web-business-app',
        );
        localStorage.setItem('oldToken', oldToken);

        localStorage.setItem(
          'oidc.user:https://lab.system123.ru/identity:web-business-app',
          getToken(oldToken, utoken),
        );

        localStorage.setItem('emplToken', getToken(oldToken, utoken));

        window.location.reload(false);
      }
    } catch (error) {
      // Handle the error and display a message to the user
      setErrorMessage('Ошибка входа под сотрудником. Попробуйте снова.');
      console.error('Login error: ', error); // You can log the error for debugging
    }
  };

  const logoutUserAccount = async () => {
    const trueToken = localStorage.getItem('oldToken');
    localStorage.setItem('oidc.user:https://lab.system123.ru/identity:web-business-app', trueToken);
    localStorage.removeItem('oldToken');
    window.location.reload(false);
  };

  var validToken = function () {
    const emplToken = localStorage.getItem('emplToken');
    const currentToken = localStorage.getItem(
      'oidc.user:https://lab.system123.ru/identity:web-business-app',
    );
    return emplToken === currentToken;
  };

  const next = (idCompany, id, idUser, type, name) => {
    setParent({
      idCompany: idCompany,
      id: id,
      type: type,
    });
    setBreadcrumb([
      ...breadcrumb,
      {
        name: name,
        idCompany: idCompany,
        id: id,
        type: type,
      },
    ]);
  };

  const back = () => {
    setBreadcrumb((breadcrumb) => breadcrumb.slice(0, -1));
    setParent({
      name: breadcrumb[breadcrumb.length - 2].name,
      idCompany: breadcrumb[breadcrumb.length - 2].idCompany,
      id: breadcrumb[breadcrumb.length - 2].id,
      type: breadcrumb[breadcrumb.length - 2].type,
    });
  };

  const search = (e) => {
    setUsersSearch(e.target.value);
  };

  return (
    <>
      <div>
        {validToken() === false ? (
          <div>
            <Button className="bm-item menu-item" onClick={handleOpen}>
              Войти под сотрудником
            </Button>
            <Dialog open={open} keepMounted onClose={handleClose} className="group-projects">
              <DialogContent>
                <div className="share">
                  <div className="share--item">
                    <span>Войти под сотрудником</span>
                  </div>
                  {errorMessage && <div className="error-message">{errorMessage}</div>}{' '}
                  {/* Display the error message */}
                  <div className="users-detail--container user-add">
                    <div className="users--filter">
                      <input
                        type="text"
                        value={usersSearch}
                        placeholder="Поиск"
                        onChange={(event) => search(event)}
                      />
                    </div>
                    <div className="project-breadcrumbs">
                      {breadcrumb.length > 0 && (
                        <div
                          className="breadcrumb-back"
                          onClick={breadcrumb.length > 1 && back}></div>
                      )}
                      <div className="breadcrumb-title">
                        {breadcrumb.length > 0 &&
                          breadcrumb.slice(-2).map((breadcrumb, index) => {
                            return <div key={index}>{breadcrumb.name}/</div>;
                          })}
                      </div>
                    </div>
                    {users?.length > 0 &&
                      users
                        .filter((user) =>
                          user.name.toLowerCase().includes(usersSearch.toLowerCase()),
                        )
                        .map((c) => {
                          return (
                            <div
                              key={c.id}
                              className="users-detail--person"
                              onClick={() =>
                                c.type == 7
                                  ? loginUserAccount(c.referredUserGuid)
                                  : next(c.idCompany, c.id, c.idUser, c.type, c.name)
                              }>
                              <div>
                                {c.type == 3 && <img src={usersImg} />}
                                {c.type == 4 && <img src={usersImg} />}
                                {c.type == 6 && <img src={usersImg} />}
                                {c.type == 7 && <img src={usersImg} />}
                                <span>{c.name} </span>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div>
            <Button className="bm-item menu-item" onClick={logoutUserAccount}>
              Выйти из под сотрудника
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default EmplButton;
