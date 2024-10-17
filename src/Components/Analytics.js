import React, { useEffect, useState, useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useSelector, useDispatch } from 'react-redux';
import { setOpenAnalytics } from '../store/reducers/analyticsSlice';
import { makeStyles } from '@material-ui/core/styles';
import Network from './Requests';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  menuPaper: {
    maxHeight: 200,
  },
});

const Analytics = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const open = useSelector((state) => state.analytics?.open);
  const currentLink = useSelector((state) => state.link?.info?.publicLinkUrl);
  const analytics = useSelector((state) => state.link?.info);
  const [insights, setInsights] = useState();

  const block = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      if (currentLink?.length > 0) {
        const a = await new Network().GetPublicLinkAnalytics(currentLink);
        setInsights(a);
      }
    };

    fetch();
  }, [currentLink]);

  if (block.current) {
    block.current.parentNode.classList.add('analytics-wrapper');
  }

  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth="lg"
      PaperProps={{
        style: {
          backgroundColor: '#fafafa',
          boxShadow: 'none',
        },
      }}
      onClose={() => {
        dispatch(setOpenAnalytics(false));
      }}>
      <DialogContent className="analytics-wrap" ref={block} onClick={() => {}}>
        {/* <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {message}
          </Alert>
        </Snackbar> */}
        <div className="share">
          <div className="flex between">
            <span>Аналитика VarStudio</span>
          </div>
          <div className="analytics-info-title">{insights?.calculationName}</div>
          <div className="analytics-info">
            <div className="analytics-info-item">
              <div className="analytics-info-name">Просмотров товаров в 3D</div>
              <div className="analytics-info-value">{analytics?.visitsCount}</div>
            </div>
            <div className="analytics-info-item">
              <div className="analytics-info-name">Просмотров товаров в AR</div>
              <div className="analytics-info-value">0</div>
            </div>
            <div className="analytics-info-item">
              <div className="analytics-info-name">Суммарное время покупателей в 3D, мин.</div>
              <div className="analytics-info-value">{analytics?.widgetUseTime}</div>
            </div>
            <div className="analytics-info-item">
              <div className="analytics-info-name">Суммарное время покупателей в AR, мин.</div>
              <div className="analytics-info-value">0</div>
            </div>
          </div>

          <div className="analytics-info-title">После просмотра товара в 3D и AR</div>
          <div className="analytics-info">
            <div className="analytics-info-item">
              <div className="analytics-info-name">Добавлено товаров в корзину, шт.</div>
              <div className="analytics-info-value">{analytics?.variantsCount}</div>
            </div>
            <div className="analytics-info-item">
              <div className="analytics-info-name">Добавлено товаров в корзину, руб.</div>
              <div className="analytics-info-value">{analytics?.ordersCount}</div>
            </div>
            <div className="analytics-info-item">
              <div className="analytics-info-name">Куплено товаров, шт.</div>
              <div className="analytics-info-value">0</div>
            </div>
            <div className="analytics-info-item">
              <div className="analytics-info-name">Куплено товаров на сумму, руб.</div>
              <div className="analytics-info-value">0</div>
            </div>
          </div>
          {/* <div className="analytics-info-item">
              <div className="analytics-info-name">Количество визитов</div>
              <div className="analytics-info-value">{insights?.visitsCount}</div>
            </div>
            <div className="analytics-info-item">
              <div className="analytics-info-name">Время просмотра виджета</div>
              <div className="analytics-info-value">{insights?.widgetUseTime}</div>
            </div>

            <div className="analytics-info-item">
              <div className="analytics-info-name">Количество заказов</div>
              <div className="analytics-info-value">{insights?.ordersCount}</div>
            </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default Analytics;
