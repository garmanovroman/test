import React, { useState } from 'react';
import {
  Button,
  Modal,
  Backdrop,
  Fade,
  makeStyles,
  CircularProgress,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import mainIcon from '../images/main_icon.jpg';

const useStyles = makeStyles((theme) => ({
  modalDropzone: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    width: '500px',
    maxWidth: '100%',
    overflowY: 'auto',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    border: 'none !important',
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  input: {
    display: 'block',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  fileError: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
  },
  selectedFile: {
    marginTop: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  uploadMessage: {
    marginTop: theme.spacing(2),
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  progressText: {
    marginLeft: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(2),
  },
}));

const DropzoneModal = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [fileError, setFileError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadComplete, setIsUploadComplete] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileExtension = file.name.split('.').pop();
      if (fileExtension.toLowerCase() !== 'b3d') {
        setFileError('Ошибка, выберите .b3d файл.');
        setSelectedFile(null);
      } else {
        setFileError('');
        setSelectedFile(file);
      }
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      setUploadMessage('Выберите файл.');
      return;
    }

    setLoading(true);
    setUploadMessage('');
    setUploadProgress(0);
    setIsUploadComplete(false);

    const storage = localStorage.getItem('company');
    const storageCompany = JSON.parse(storage);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('IdCompany', storageCompany?.id);

    try {
      await axios.post('https://api.system123.ru/api/Projects/ConvertFromBazis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      setUploadMessage(
        <>
          Файл "{selectedFile.name}" успешно загружен. В процессе конвертации создастся чат с
          картинкой{' '}
          <img
            src={mainIcon}
            alt="Conversion Icon"
            style={{
              width: '50px',
              height: '50px',
              verticalAlign: 'sub',
              margin: '0 5px',
            }}
          />
          и в нём будет отображаться процесс конвертации. Результат конвертации будет добавлен в
          этот же чат.
        </>,
      );
      setSelectedFile(null); // Clear the selected file
      setIsUploadComplete(true);
    } catch (error) {
      setUploadMessage('Ошибка загрузки файла. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (isUploadComplete) {
      props.onCloseMenu();
    }
    setUploadMessage('');
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploadComplete(false);
  };

  return (
    <>
      <div>
        <Modal
          aria-labelledby="date-range-modal-title"
          aria-describedby="date-range-modal-description"
          className={classes.modalDropzone}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}>
          <Fade in={open}>
            <div className={classes.paper}>
              <IconButton className={classes.closeButton} onClick={handleClose}>
                <CloseIcon />
              </IconButton>
              <h3 id="simple-modal-title" style={{ marginBottom: 15 }}>
                Конвертировать из базиса
              </h3>
              <div>
                <input type="file" onChange={handleFileChange} className={classes.input} />
                {fileError && <p className={classes.fileError}>{fileError}</p>}
                {selectedFile && (
                  <p className={classes.selectedFile}>Выбран файл: {selectedFile.name}</p>
                )}
                {selectedFile && (
                  <div style={{ marginTop: 10 }}>
                    {/* <p>
                      Теперь можно начать конвертацию. В процессе конвертации создастся чат с
                      картинкой{' '}
                      <img
                        src={mainIcon}
                        alt="Conversion Icon"
                        style={{
                          width: '50px',
                          height: '50px',
                          verticalAlign: 'sub',
                          margin: '0 5px',
                        }}
                      />
                      и в нём будет отображаться процесс конвертации. Результат конвертации будет
                      добавлен в этот же чат.
                    </p> */}
                    <p>Хотите именно этот файл конвертировать?</p>
                  </div>
                )}
              </div>
              {uploadMessage && <p className={classes.uploadMessage}>{uploadMessage}</p>}
              {loading && (
                <div className={classes.loadingContainer}>
                  <CircularProgress size={24} />
                  <span className={classes.progressText}>Загрузка: {uploadProgress}%</span>
                </div>
              )}
              <div>
                <Button
                  onClick={isUploadComplete ? handleClose : uploadFile}
                  disabled={loading} // Disable only during the loading process
                  className={classes.submitButton}>
                  {isUploadComplete ? 'OK' : 'Конвертировать'}
                </Button>
                {!loading && !isUploadComplete && (
                  <Button onClick={handleClose} className={classes.submitButton}>
                    Нет
                  </Button>
                )}
              </div>
            </div>
          </Fade>
        </Modal>
        <Button className="bm-item menu-item" onClick={handleOpen}>
          Конвертировать из базиса
        </Button>
      </div>
    </>
  );
};

export default DropzoneModal;
