import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { linkActive } from '../store/reducers/linkSlice';
import { setProductStore } from '../store/reducers/saveGuids';
import { globalConfig } from '../configuration/config';
import { useEffect } from 'react';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 200,
    backgroundColor: theme.palette.background.paper,
    border: '0px solid #000',
    padding: 20,
    borderRadius: 15,
  },
}));

export default function OpenNewLink() {
  const linkOpen = useSelector((state) => state.link.open);
  const projectGuid = useSelector((state) => state?.variant?.current?.projectGuid);
  const isGuidDispayType = useSelector((state) => state?.guids?.guidDisplayType);
  const calculationGuid = useSelector((state) => state?.variant?.current?.calculationGuid);
  const isCatalog = useSelector((state) => state?.project?.templateStatusOpen);
  const dispatch = useDispatch();

  const openWidget = () => {
    if (typeof window.varwidget !== 'undefined') {
      window.varwidget.showCalculation(calculationGuid);
    }
  };

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const handleClose = () => {
    dispatch(linkActive(false));
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <a
        href={`${globalConfig.config.common.widget}v0/project/${projectGuid}?calculation=${calculationGuid}&room=${calculationGuid}&isCatalog=${isCatalog}`}
        target="_blank"
        className="full-width">
        Vroom+ (вкладка)
      </a>
      <a className="full-width" onClick={openWidget}>
        Vroom+
      </a>
      <a
        href={`${globalConfig.config.common.vroom}?calculation=${calculationGuid}&project=${
          isGuidDispayType?.length > 0 ? isGuidDispayType : projectGuid
        }&room=${calculationGuid}&isCatalog=${isCatalog}`}
        target="_self"
        className="full-width">
        VRoom
      </a>
      <a
        href={`${globalConfig.config.common.widget_staging}v0/project/${projectGuid}?calculation=${calculationGuid}&room=${calculationGuid}&isCatalog=${isCatalog}`}
        target="_blank"
        className="full-width">
        Vroom+ (тестировочный)
      </a>
    </div>
  );

  return (
    <div>
      <Modal
        open={linkOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        {body}
      </Modal>
    </div>
  );
}
