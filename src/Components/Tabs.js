import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Chat from './Chat';
import { useSelector, useDispatch } from 'react-redux';
import { setDisplayType } from '../store/reducers/variantSlice';
import {} from '../store/reducers/saveGuids';
import { setCurrent, setLockImg } from '../store/reducers/variantSlice';
import Network from './Requests';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const variants = useSelector((state) => state.variant.list);
  const frameLoad = useSelector((state) => state?.variant.frameLoad);
  const [variantsList, setVariantsList] = React.useState(variants);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const setDisplayTypeFunc = () => {
    dispatch(setDisplayType(true));
  };

  useEffect(() => {
    setVariantsList(variants);
  }, [variants]);

  useEffect(() => {
    setVariantsList(variants);
  }, [variants]);

  useEffect(() => {
    if (frameLoad) {
    }
  }, [frameLoad]);

  const setCurrentVariant = async (guid) => {
    const calculationInfo = await new Network().getCalculationInfo(guid);

    let insert = {};

    insert.projectGuid = props.project.projectGuid;
    insert.calculationGuid = guid;
    insert.sphere_360Path = calculationInfo?.views?.sphere_360Path;
    insert.iconPath = calculationInfo?.views?.mainIconPath;
    insert.sequenceData = calculationInfo?.views?.sequenceData;
    insert.idCompany = calculationInfo?.idCompany;

    if (
      calculationInfo?.views?.sphere_360Path != null &&
      !calculationInfo?.views?.sphere_360Path.includes('default')
    ) {
      const azimuth = await new Network().GetFileAzimuth(calculationInfo?.views?.sphere_360Path);
      insert.azimuth = azimuth.azimuth;
    }
    dispatch(setCurrent(insert));
  };

  props.project.variantGuid = props.variantGuid;

  return (
    <div className="tabs-view">
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="">
          {props.project.chats.map((c, index) => {
            return c.type == 1 ? (
              <Tab className="left button-arrow" label="" {...a11yProps(0)} />
            ) : (
              <Tab className="right button-arrow" label="" {...a11yProps(1)} />
            );
          })}
        </Tabs>
      </AppBar>
      {props.project.chats.map((c, index) => {
        return c.type == 1 ? (
          <TabPanel value={value} index={0}>
            <Chat
              connect={props.connect}
              guid={c.guid}
              project={props.project}
              sortChat={props.sortChat}
              addDisplayType={setDisplayTypeFunc}
              user={props?.user}
              setVariant={setCurrentVariant}
              variantGuid={props?.variantGuid}
              variants={variantsList}
              updateLastMessage={props.updateLastMessage}
            />
          </TabPanel>
        ) : (
          <TabPanel value={value} index={1}>
            <Chat
              connect={props.connect}
              guid={c.guid}
              project={props.project}
              sortChat={props.sortChat}
              addDisplayType={setDisplayTypeFunc}
              user={props?.user}
              setVariant={setCurrentVariant}
              variantGuid={props?.variantGuid}
              variants={variantsList}
              updateLastMessage={props.updateLastMessage}
            />
          </TabPanel>
        );
      })}
    </div>
  );
}
