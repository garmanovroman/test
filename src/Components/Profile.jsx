import React, { useEffect, useState } from 'react';
import Network from './Requests';
import ReactFileReader from 'react-file-reader';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../store/reducers/usersSlice';

const Profile = (props) => {
  const [user, setUser] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      const userInfo = await new Network().GetUsersInfo();
      dispatch(setCurrentUser(userInfo));
      const data = {
        guid: userInfo.guid,
        data: {
          login: { name: 'Логин', value: userInfo.login, nameInput: 'login' },
          name: { name: 'Имя', value: userInfo.name, nameInput: 'name' },
          lastName: { name: 'Фамилия', value: userInfo.lastName, nameInput: 'lastName' },
          patronymic: { name: 'Отчество', value: userInfo.patronymic, nameInput: 'patronymic' },
          email: { name: 'Email', value: userInfo.email, nameInput: 'email' },
          phone: { name: 'Телефон', value: userInfo.phone, nameInput: 'phone' },
        },
        avatar: userInfo.profilePictureFilePath,
      };
      setUser(data);
    };
    fetch();
  }, []);

  const changeInput = (e) => {
    document.querySelectorAll('[name=""]').forEach((elem) => (elem.disabled = true));

    document.querySelectorAll('[name="' + e + '"]').forEach((elem) => (elem.disabled = false));
  };

  const handlerBlur = (e) => {
    document.querySelectorAll('[name="' + e + '"]').forEach((elem) => (elem.disabled = true));
  };

  const updateMessageInputValue = (evt) => {
    const nameInp = evt.target.name;
    const valueInp = evt.target.value;

    setUser((prevState) => ({
      ...user,
      data: {
        ...prevState.data,
        [nameInp]: {
          ...prevState.data[nameInp],
          value: valueInp,
        },
      },
    }));
  };

  const close = () => {
    props.close();
  };

  const save = async () => {
    const updateUser = await new Network().updateUser(
      user.data.name.value,
      user.data.lastName.value,
      user.data.patronymic.value,
      user.data.email.value,
      user.data.phone.value,
    );
    props.close();
  };

  const handleFiles = async (files) => {
    const formData = new FormData();
    formData.append('userGuid', user.guid);
    formData.append('picture', files[0]);
    const updateAvatarUser = await new Network().updateAvatarUser(user.guid, formData);
    setUser({
      ...user,
      avatar: updateAvatarUser.replace(/['"]+/g, ''),
    });
  };

  return (
    <>
      <div className="profile">
        <ReactFileReader handleFiles={handleFiles}>
          <div className="profile--img--container">
            <img src={user.avatar} className="profile--img" />
          </div>
        </ReactFileReader>
        {user.data &&
          Object.keys(user.data)?.map((c, index) => {
            return (
              <>
                <div className="flex-base jc-b ai-c">
                  <span>{user.data[c].name}</span>:{' '}
                  <input
                    className="value"
                    name={user.data[c].nameInput}
                    value={user.data[c].value}
                    disabled="disabled"
                    onBlur={() => handlerBlur(c)}
                    onChange={(event) => updateMessageInputValue(event)}
                    autoComplete="off"
                  />
                  <span className="edit" onClick={() => changeInput(c)}></span>
                </div>
              </>
            );
          })}
        <div className="profile-action flex-base ai-c jc-e">
          <div className="profile-cancel button" onClick={() => close()}>
            Отмена
          </div>
          <div className="profile-save button" onClick={() => save()}>
            Сохранить
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
