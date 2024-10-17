import React from 'react';
import Profile from './Profile';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';


export default function EditProfile() {
  const [open, setOpen] = React.useState(false);
  const [openGroup, setOpenGroup] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenGroup(false);
  };
  
  const handleOpenGroup = () => {
    setOpenGroup(true);
  }

  return (
    <div>
      <Button className="bm-item menu-item" onClick={handleClickOpen}>
        Профиль
      </Button>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
      >
        <DialogContent>
          <Profile close={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}