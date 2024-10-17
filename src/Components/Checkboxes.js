import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Network from './Requests';
import { useSelector, useDispatch } from 'react-redux';
import { addUserProject, deleteUserProject } from '../store/reducers/saveGuids';

export default function Checkboxes(props) {
  const [checked, setChecked] = React.useState(props.checked);
  let chats = [];

  const dispatch = useDispatch();

  for (let chat = 0; chat < props.chatGuid.length; chat++) {
    const element = props.chatGuid[chat];
    chats.push(element.guid);
  }

  const handleChange = (e) => {
    if (e.target.checked) {
      setChecked(e.target.checked);
      dispatch(
        addUserProject({
          userGuid: props.userGuid,
          companyId: props.companyId,
        }),
      );
      // const send = new Network().AddUserInChats(chats, props.userGuid, props.companyId);
    } else {
      setChecked(e.target.checked);
      dispatch(
        deleteUserProject({
          userGuid: props.userGuid,
          companyId: props.companyId,
        }),
      );
      // const send = new Network().DeleteUserfromChats(chats, props.userGuid, props.companyId);
    }
  };

  return (
    <div>
      <Checkbox
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
    </div>
  );
}
