import React, { useEffect, useState } from 'react';
import PhotoSphereViewer from './PhotoSphereViewer';
import Demo from './Demo';
import ReactPhotoSphereViewer from 'react-photosphere';
import Pano from './Pano';
import { data } from '../data/data';
import Calculations from './Calculations';
import Network from './Requests';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { v4 as uuidv4 } from 'uuid';
import { globalConfig } from '../configuration/config';
import { useSelector, useDispatch } from 'react-redux';
import { setList, setCurrent, setFrameLoad, setLockImg } from '../store/reducers/variantSlice';
import usePrevious from './hooks/usePrevious';
import {} from '../store/reducers/saveGuids';
import { ContactsOutlined, ScoreOutlined } from '@material-ui/icons';

export default function DetailProject(props) {
  const [firstOpen, setFirstOpen] = useState(true);
  const variant = useSelector((state) => state.variant.list);
  const current = useSelector((state) => state.variant.current);
  const templateSelect = useSelector((state) => state.project.templateSelect);
  const dispatch = useDispatch();
  const variantFromFullscreen = localStorage.getItem('variant');
  const userGuid = useSelector((state) => state?.guids?.userGuid);
  const companyId = useSelector((state) => state.project.companyId);
  const frameLoad = useSelector((state) => state?.variant.frameLoad);
  const lockImg = useSelector((state) => state?.variant.lockImg);
  const iconPath = useSelector((state) => state?.variant.current?.iconPath);
  const mainIconPath = useSelector((state) => state?.variant.current?.mainIconPath);
  const [loadFrame, setLoadFrame] = useState(false);
  // const [lockImg, setLockImg] = useState(props.lockImg);
  const [loadElem, setLoadElem] = useState(true);
  let insert = {};

  const elementScroll = React.createRef();
  const scrollBlock = React.createRef();
  const prev = usePrevious(variant?.current?.calculationGuid);

  useEffect(() => {
    const imgLoaded = (e) => {
      if (e.data.type == 'loadImage' && e.data.value == true) {
        dispatch(setLockImg(false));
      }
    };
    window.addEventListener('message', imgLoaded);
  }, []);

  useEffect(() => {
    // var chat = props.currentChat;
    // window.changeChat = (chat) => {
    //   console.log(chat, 'Изменился чат для UE');
    // };
    // window.changeChat(props.currentChat);
  }, [props.currentChat]);

  React.useEffect(() => {
    dispatch(setLockImg(true));
  }, [current?.calculationGuid]);

  const variantClick = async (c) => {
    let calculationInfo;
    if (props.current.forDisplayTape == true) {
      if (props.current.isBaseProject) {
        calculationInfo = await new Network().getCalculationInfo(c.calculationGuid);
      } else {
        calculationInfo = await new Network().getCalculationInfo(c.calculationGuid);
      }

      let insert = {};
      console.log(insert, 'insertinsert 1');
      insert.calculationGuid = calculationInfo?.guid;
      insert.projectGuid = props.guid;

      insert.sphere_360Path = calculationInfo?.views?.sphere_360Path;
      insert.sequenceData = calculationInfo?.views?.sequenceData;
      insert.iconPath = calculationInfo?.views?.mainIconPath;
      insert.idCompany = calculationInfo?.idCompany;
      insert.calculationName = calculationInfo?.name;
      if (
        calculationInfo?.views?.sphere_360Path != null &&
        !calculationInfo?.views?.sphere_360Path.includes('default')
      ) {
        const azimuth = await new Network().GetFileAzimuth(calculationInfo?.views?.sphere_360Path);
        insert.azimuth = azimuth.azimuth;
      }
      if (!props.current.isBaseProject) {
        new Network().AddDisplayTape(c.guid, props.guid, userGuid, companyId).then((result) => {
          props.onAddProject(result, false, null, null, null, false);
          dispatch(setCurrent(insert));
        });
      } else {
        dispatch(setCurrent(insert));
      }
    } else {
      const calculationInfo = await new Network().GetCalculationViews(c.calculationGuid);
      let insert = {};

      console.log(insert, 'insertinsert 2');
      insert.calculationGuid = c.calculationGuid;
      insert.calculationName = c.calculationName;
      insert.createdAt = c.createdAt;
      insert.iconPath = calculationInfo?.mainIconPath;
      insert.idCompany = c.idCompany;
      insert.idQuality = c.idQuality;
      insert.isMainVariant = c.isMainVariant;
      insert.projectGuid = c.projectGuid;
      insert.timestamp = c.timestamp;

      insert.sphere_360Path = calculationInfo?.sphere_360Path;
      insert.sequenceData = calculationInfo?.sequenceData;

      if (
        calculationInfo?.sphere_360Path != null &&
        !calculationInfo?.sphere_360Path.includes('default')
      ) {
        const azimuth = await new Network().GetFileAzimuth(calculationInfo?.sphere_360Path);
        insert.azimuth = azimuth.azimuth;
      }
      dispatch(setCurrent(insert));
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const variantReq = await new Network().GetVariantss(props.guid, null, false, false, null, 20);
      props.loadDetail();
      if (localStorage.getItem('joinLink') === 'true') {
        const variant = variantReq.find(
          (i) => i.calculationGuid == localStorage.getItem('guidCalculation'),
        );
        const calculationInfo = await new Network().GetCalculationViews(variant?.calculationGuid);
        let a = Object.assign(variant, calculationInfo);
        a.catalog = false;

        dispatch(setList(variantReq));
        dispatch(setCurrent(a));

        localStorage.setItem('joinLink', false);
      } else {
        if (props.openCatalog && props?.current?.projectGuid) {
        } else if (props.currentVariant?.length > 0) {
          const variant = variantReq.find(
            (variant) => variant.calculationGuid == props.currentVariant,
          );

          const calculationInfo = await new Network().GetCalculationViews(props.currentVariant);
          let a = Object.assign(variant, calculationInfo);
          a.catalog = false;
          dispatch(setList(variantReq));
          dispatch(setCurrent(a));

          props.clearCurrentVariant();
        } else {
          const calculationInfo = await new Network().GetCalculationViews(
            variantReq[variantReq.length - 1]?.calculationGuid,
          );

          let a = Object.assign(variantReq[variantReq.length - 1], calculationInfo);
          a.catalog = false;
          a.iconPath = calculationInfo?.views?.mainIconPath;
          if (
            calculationInfo?.sphere_360Path != null &&
            !calculationInfo?.sphere_360Path.includes('default')
          ) {
            const azimuth = await new Network().GetFileAzimuth(calculationInfo?.sphere_360Path);
            a.azimuth = azimuth?.azimuth;
          }

          dispatch(setList(variantReq));
          dispatch(setCurrent(a));
        }
      }
    };

    const fetchBase = async () => {
      if (props.openCatalog == true && templateSelect != '') {
        // const variantReqs = await new Network().GetBaseProject(props.guid);
        const variantReq = await new Network().GetVariantss(
          props.guid,
          null,
          false,
          false,
          null,
          20,
        );
        props.loadDetail();
        const calculationInfo = await new Network().getCalculationInfo(
          variantReq[0]?.calculationGuid,
        );

        insert = {};
        insert.calculationName = variantReq[0].calculationName;
        insert.guid = variantReq[0]?.guid;
        insert.isMainVariant = variantReq[0]?.isMainVariant;
        insert.projectGuid = props.guid;
        insert.calculationGuid = calculationInfo.guid;
        insert.sphere_360Path = calculationInfo?.views?.sphere_360Path;
        insert.iconPath = calculationInfo?.views?.mainIconPath;
        insert.sequenceData = calculationInfo?.views?.sequenceData;
        insert.idCompany = calculationInfo?.idCompany;
        insert.catalog = false;

        if (
          calculationInfo?.views?.sphere_360Path != null &&
          !calculationInfo?.views?.sphere_360Path.includes('default')
        ) {
          const azimuth = await new Network().GetFileAzimuth(
            calculationInfo?.views?.sphere_360Path,
          );
          insert.azimuth = azimuth?.azimuth;
        }

        dispatch(setList(variantReq));
        dispatch(setCurrent(insert));

        // scrollVariantList();
      } else if (props.openCatalog == false) {
        console.log('CurrentInter 7');
        const req = await new Network().GetVariantss(
          props.guid,
          props?.current?.guidDisplayTape,
          false,
          false,
          null,
          20,
        );
        props.loadDetail();
        const calculationInfo = await new Network().getCalculationInfo(
          props?.current?.calculations[0]?.guid,
        );

        insert = {};

        insert.projectGuid = props.guid;
        insert.calculationGuid = props?.current?.calculations[0]?.guid;
        insert.sphere_360Path = calculationInfo?.views?.sphere_360Path;
        insert.sequenceData = calculationInfo?.views?.sequenceData;
        insert.iconPath = calculationInfo?.views?.mainIconPath;
        insert.idCompany = calculationInfo?.idCompany;
        insert.timestamp = calculationInfo?.timestamp;
        insert.calculationName = calculationInfo?.name;
        if (
          calculationInfo?.views?.sphere_360Path != null &&
          !calculationInfo?.views?.sphere_360Path.includes('default')
        ) {
          const azimuth = await new Network().GetFileAzimuth(
            calculationInfo?.views?.sphere_360Path,
          );
          insert.azimuth = azimuth.azimuth;
        }

        dispatch(setList(req));
        dispatch(setCurrent(insert));

        props.clearCurrentVariant();
      }
    };
    if (props.current.forDisplayTape == true) {
      fetchBase();
    } else {
      fetch();
    }

    if (props.currentVariant?.length > 0) {
      var cusid_ele = document.getElementsByClassName('projects');
      cusid_ele[0].classList.add('active');
    } else if (firstOpen) {
      var cusid_ele = document.getElementsByClassName('projects');
      cusid_ele[0].classList.remove('active');
      var cusid_ele = document.getElementsByClassName('open-project');
      cusid_ele[0].classList.remove('active');
      setFirstOpen(false);
    }
  }, [props.current.guidDisplayTape, props.guid, props.openCatalog, templateSelect]);

  const setLoad = () => {
    setLoadFrame(true);
  };

  useEffect(() => {
    if (current?.azimuth) {
      var iFrame = document.getElementById('view-container-iframe');
      if (iFrame != null) {
        const resultAzumit = (2 * Math.PI * current?.azimuth) / 360;
        const azimuth = {
          type: 'azimuth',
          value: resultAzumit,
        };

        iFrame.contentWindow.postMessage(azimuth, '*');
      }
    }
    if (loadFrame) {
      dispatch(setFrameLoad(true));
    }
  }, loadFrame);

  useEffect(() => {
    if (current?.calculationGuid?.length > 0) {
      props.onChangeVariant(current);

      if (props.openCatalog) {
        const indexElement = variant.findIndex((item) => item.guid == current?.calculationGuid);

        if (indexElement != -1) {
          document
            .getElementsByClassName('variant-wth-dell')
            [indexElement].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        const indexElement = variant.findIndex(
          (item) => item.calculationGuid == current?.calculationGuid,
        );

        if (indexElement != -1) {
          document
            .getElementsByClassName('variant-wth-dell')
            [indexElement].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [current]);

  const scrollHorizontally = async (e) => {
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
    document.querySelector('.variant-list').scrollLeft -= delta * 10; // Multiplied by 10
    e.preventDefault();

    const scrollElement = elementScroll.current.getBoundingClientRect();
    const scrollView = scrollBlock.current.getBoundingClientRect();

    if (scrollElement.bottom - scrollView.bottom <= 150 && loadElem) {
      setLoadElem(false);
      const variantReq = await new Network().GetVariantss(
        props.guid,
        null,
        false,
        false,
        variant[variant.length - 1].calculationGuid,
        20,
      );
      const result = [...variant, ...variantReq];
      dispatch(setList(result));
      setLoadElem(true);
    }
  };

  const currentVariantIndex = (ar, el) => {
    var a;
    if (ar[0]?.calculationGuid) {
      var a = ar.findIndex((i) => i.calculationGuid == el.calculationGuid);
    } else {
      var a = ar.findIndex((i) => i.guid == el.calculationGuid);
    }

    if (a != -1) {
      return a + 1;
    }
  };

  return (
    <div className="psv-view">
      <Calculations
        displayTape={props.current.forDisplayTape}
        current={current}
        variant="true"
        company={props.company}
        changeCatalog={props.changeCatalog}
        openTemplate={props.openTemplate}
      />
      <div className="detail-variant">
        <div
          id="variant-list"
          className="variant-list"
          onWheel={(e) => scrollHorizontally(e)}
          ref={scrollBlock}>
          {variant?.map((c, index) => {
            return (
              <div
                key={c?.calculationGuid}
                className="variant-wth-dell"
                style={{
                  backgroundImage: `url(${c?.iconPath ? c?.iconPath : c?.mainIconPath}?timestamp=${
                    c.timestamp
                  })`,
                }}>
                {c.isMainVariant == true && <div className="favorites"></div>}
                <div
                  className={
                    c?.guid == current?.calculationGuid ||
                    c?.calculationGuid == current?.calculationGuid
                      ? 'variant-item active'
                      : 'variant-item'
                  }
                  onClick={() => {
                    variantClick(c);
                  }}>
                  <span>{index + 1}</span>
                  {c?.usedInOtherProjects && <span className="label-project"></span>}
                </div>
              </div>
            );
          })}
          <div class="load-block-variant" ref={elementScroll}></div>
        </div>
        <div className="current-variant">{currentVariantIndex(variant, current)}</div>
      </div>
      {current != undefined && (
        <div className={current?.isMainVariant === true ? 'detail-prj favourite' : 'detail-prj'}>
          {lockImg && (
            <div
              className="preview-img"
              style={{
                backgroundImage: `url(${iconPath ? iconPath : mainIconPath})`,
              }}></div>
          )}
          {Object.keys(current).length == 0 ? (
            'Нет главного изображения или не добавлен вариант'
          ) : current.sphere_360Path != null ? (
            <Pano
              chat={props?.currentChat}
              variant={current?.calculationGuid}
              guid={props?.guid}
              data={data}
              img={current?.sphere_360Path}
              loadFrame={() => setLoad()}
              user={props?.user}
              current={current}
            />
          ) : (
            <Demo
              projectGuid={props.guid}
              variant={current?.calculationGuid}
              chat={props?.currentChat}
              count={current?.sequenceData?.sequenceCount}
              guid={current?.calculationGuid}
              img={current?.sequenceData?.sequencePath}
              first={current?.sequenceData?.sequenceFirst}
              ext={current?.sequenceData?.sequenceExt}
              user={props?.user}
              current={current}
              loadFrame={() => setLoad()}
            />
          )}
        </div>
      )}
    </div>
  );
}
