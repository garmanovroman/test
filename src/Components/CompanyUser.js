import React, { useEffect, useState } from 'react';
import Network from './Requests';
import Checkboxes from './Checkboxes';
import usersImg from '../images/users.png';
import client from '../images/client.png';
import guest from '../images/guest.png';
import { useDispatch, useSelector } from 'react-redux';
import { clearUsers } from '../store/reducers/saveGuids';

export default function CompanyUser(props) {
  const dispatch = useDispatch();
  const initialBreadcrumbState = [
    {
      name: 'Компания',
      projectGuid: props.projectGuid,
      idCompany: null,
      id: null,
      idUser: null,
      type: null,
    },
    {
      name: props.companyName,
      projectGuid: props.projectGuid,
      idCompany: props.companyId,
      id: null,
      idUser: null,
      type: 4,
    },
  ];
  const [users, setUsers] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState(initialBreadcrumbState);
  const [usersSearch, setUsersSearch] = useState('');
  const [parent, setParent] = useState({
    projectGuid: props.projectGuid,
    idCompany: props.companyId,
    id: null,
    idUser: null,
    type: 4,
  });

  const guidAdd = useSelector((state) => state?.guids?.usersAddProject?.add);
  const guidDelete = useSelector((state) => state?.guids?.usersAddProject?.delete);

  useEffect(() => {
    getItems(parent?.projectGuid, parent?.idCompany, parent?.id, parent?.idUser, parent?.type);
  }, [props.projectGuid, parent]);

  const getItems = async (projectGuid, idCompany, id, idUser, type) => {
    const data = await new Network().GetUserCatalog(projectGuid, idCompany, id, idUser, type);
    setUsers(data);
  };

  const search = (e) => {
    setUsersSearch(e.target.value);
  };

  const next = (projectGuid, idCompany, id, idUser, type, name) => {
    setParent({
      projectGuid: projectGuid,
      idCompany: idCompany,
      id: id,
      idUser: idUser,
      type: type,
    });
    setBreadcrumb([
      ...breadcrumb,
      {
        name: name,
        projectGuid: projectGuid,
        idCompany: idCompany,
        id: id,
        idUser: idUser,
        type: type,
      },
    ]);
  };

  const back = () => {
    setBreadcrumb((breadcrumb) => breadcrumb.slice(0, -1));
    setParent({
      name: breadcrumb[breadcrumb.length - 2].name,
      projectGuid: breadcrumb[breadcrumb.length - 2].projectGuid,
      idCompany: breadcrumb[breadcrumb.length - 2].idCompany,
      id: breadcrumb[breadcrumb.length - 2].id,
      idUser: breadcrumb[breadcrumb.length - 2].idUser,
      type: breadcrumb[breadcrumb.length - 2].type,
    });
  };

  const setCheckbox = (arrAdd, arrDelete, value) => {
    var usersAdd = arrAdd.filter(function (obj) {
      return obj.userGuid == value;
    });

    var usersDelete = arrDelete.filter(function (obj) {
      return obj.userGuid == value;
    });

    if (usersAdd.length > 0) {
      return true;
    } else if (usersDelete.length > 0) {
      return false;
    } else {
      return null;
    }
  };

  let chats = [];
  const saveUsers = async () => {
    for (let chat = 0; chat < props.chats.length; chat++) {
      const element = props.chats[chat];
      chats.push(element.guid);
    }
    const data = await new Network().HandleUserInChats(chats, guidAdd, guidDelete);
    dispatch(clearUsers());
    props.closePopup();
  };
  const searchedUsers = users.filter((user) =>
    user.name.toLowerCase().includes(usersSearch.toLowerCase()),
  );

  return (
    <div className="share">
      <div className="share--item">
        <span>Добавить пользователя компании</span>
      </div>
      <div
        className="share-close"
        onClick={() => {
          setParent({
            projectGuid: props.projectGuid,
            idCompany: props.companyId,
            id: null,
            idUser: null,
            type: 4,
          });
          setBreadcrumb(initialBreadcrumbState);
          props.close();
        }}>
        X
      </div>
      <div className="users-detail--container user-add">
        <div className="users--filter">
          <input
            type="text"
            value={usersSearch}
            placeholder="Поиск"
            onKeyDown={(e) => e.stopPropagation()}
            onChange={(event) => search(event)}
          />
        </div>
        <div className="project-breadcrumbs">
          {breadcrumb.length > 0 && (
            <div className="breadcrumb-back" onClick={breadcrumb.length > 1 && back}></div>
          )}
          <div className="breadcrumb-title">
            {breadcrumb.length > 0 &&
              breadcrumb.slice(-2).map((breadcrumb, index) => {
                return <div key={index}>{breadcrumb.name}/</div>;
              })}
          </div>
        </div>

        {searchedUsers?.length == 0 && (
          <div className="share--item">По вашему запросу ничего не найдено</div>
        )}

        {users?.length > 0 &&
          props.chats?.length > 0 &&
          users
            .filter((user) => user.name.toLowerCase().includes(usersSearch.toLowerCase()))
            .map((c) => {
              return (
                <div className="users-container">
                  <div className="users-checkbox">
                    {c.type == 7 && (
                      <Checkboxes
                        checked={
                          setCheckbox(guidAdd, guidDelete, c.referredUserGuid) != null
                            ? setCheckbox(guidAdd, guidDelete, c.referredUserGuid)
                            : c.existInProject
                        }
                        userGuid={c.referredUserGuid}
                        chatGuid={props.chats}
                        companyId={c.idCompany}
                      />
                    )}
                  </div>
                  <div
                    className="users-detail--person"
                    onClick={() =>
                      next(props.projectGuid, c.idCompany, c.id, c.idUser, c.type, c.name)
                    }>
                    <div>
                      {c.type == 1 && <img src={client} />}
                      {c.type == 2 && <img src={guest} />}
                      {c.type == 3 && <img src={usersImg} />}
                      {c.type == 4 && <img src={usersImg} />}
                      {c.type == 6 && <img src={usersImg} />}
                      {c.type == 8 && <img src={usersImg} />}

                      {c.login == null ? (
                        <span>{c.name}</span>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{c.name}</span>
                          <span>{c.login}</span>
                        </div>
                      )}
                    </div>
                    {c.type == 5 && (
                      <Checkboxes
                        checked={
                          setCheckbox(guidAdd, guidDelete, c.referredUserGuid) != null
                            ? setCheckbox(guidAdd, guidDelete, c.referredUserGuid)
                            : c.existInProject
                        }
                        userGuid={c.referredUserGuid}
                        chatGuid={props.chats}
                        companyId={c.idCompany}
                      />
                    )}
                  </div>
                </div>
              );
            })}
      </div>
      {(guidAdd.length > 0 || guidDelete.length > 0) && (
        <div className="share-save-container">
          <div className="share-save" onClick={saveUsers}>
            Сохранить
          </div>
        </div>
      )}
    </div>
  );
}
