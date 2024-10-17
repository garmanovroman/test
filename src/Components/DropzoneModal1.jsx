import React, { useState } from 'react';
import { Modal, Button, Box, Typography, Backdrop, Fade } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import axios from 'axios'; // To handle file upload

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  padding: 20,
  boxShadow: 24,
};

const DropzoneModal = ({ open, handleClose }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  var storage = localStorage.getItem('company');
  var storageCompany = JSON.parse(storage);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Reset error on new drop
      setError(null);

      // Check if the file extension is .b3d
      const isValid = acceptedFiles.every((file) => file.name.toLowerCase().endsWith('.b3d'));

      if (isValid) {
        setFiles(acceptedFiles);
      } else {
        setError('Please upload a valid .b3d file.');
        setFiles([]); // Clear any invalid files
      }
    },
    accept: '.b3d', // Accept only .b3d files
  });

  const handleSave = async () => {
    if (files.length === 0) {
      alert('No valid files selected!');
      return;
    }

    const formData = new FormData();
    formData.append('file', files[0]); // Assuming only one file is selected

    try {
      // Replace with your server upload endpoint
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response.data);
      alert('File uploaded successfully!');
      handleClose();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}>
      <Fade in={open}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Upload a File
          </Typography>
          <div
            {...getRootProps()}
            style={{
              border: '1px solid #ddd',
              padding: '20px',
              textAlign: 'center',
              marginTop: '10px',
            }}>
            <input {...getInputProps()} />
            {files.length === 0 ? (
              <p>Drag 'n' drop a .b3d file here, or click to select one</p>
            ) : (
              <p>{files.map((file) => file.name).join(', ')}</p>
            )}
          </div>
          {error && <Typography color="error">{error}</Typography>}
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
            onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

const ParentComponent = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Open Dropzone Modal
      </Button>
      <DropzoneModal open={open} handleClose={handleClose} />
    </div>
  );
};

export default ParentComponent;
