import React, { useState, useEffect } from 'react';
import { Button, Modal, Backdrop, Fade, makeStyles } from '@material-ui/core';
import axios from 'axios';
import Network from './Requests';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4, 6, 5),
    borderRadius: 8,
  },
}));

const ExportExel = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  var storage = localStorage.getItem('company');
  var storageCompany = JSON.parse(storage);

  const handleClose = async () => {
    try {
      const response = await new Network().GetChatsExcel(
        storageCompany?.id,
        new Date(fromDate),
        new Date(toDate),
      );
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
    setOpen(false);
  };

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
    if (event.target.value > toDate) {
      setToDate(''); // Reset 'to' date if it is earlier than 'from' date
    }
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  return (
    <>
      <div>
        <Modal
          aria-labelledby="date-range-modal-title"
          aria-describedby="date-range-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}>
          <Fade in={open}>
            <div className={classes.paper}>
              <h3 id="simple-modal-title" style={{ marginBottom: 15 }}>
                Выгрузка CRM в Excel
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <label>
                  Дата начала периода:
                  <input type="date" value={fromDate} onChange={handleFromDateChange} />
                </label>
              </div>
              <div>
                <label>
                  Дата конца периода:
                  <input
                    type="date"
                    value={toDate}
                    onChange={handleToDateChange}
                    min={fromDate} // Prevent selecting 'to' date earlier than 'from' date
                  />
                </label>
              </div>

              <input
                type="submit"
                value="Выгрузить"
                onClick={handleClose}
                style={{ marginTop: 20 }}
              />
            </div>
          </Fade>
        </Modal>
        <Button className="bm-item menu-item" onClick={handleOpen}>
          Выгрузка CRM в Excel
        </Button>
      </div>
    </>
  );
};

export default ExportExel;
